// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import getConnection from "@/lib/db";
import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";

interface UsuarioRow extends RowDataPacket {
  IdUsuario: number;
  Nombre: string;
  Apellido: string;
  Correo: string;
  Contraseña: string | null;
  Rol: string;
  Estado: number;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email:    { label: "Correo",     type: "text"     },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (
          !credentials ||
          !credentials.email.endsWith("@upqroo.edu.mx")
        ) {
          // dominio no permitido
          return null;
        }
        const pool = await getConnection();
        const [rows] = await pool.query<UsuarioRow[]>(
          "SELECT * FROM Usuarios WHERE Correo = ?",
          [credentials.email]
        );
        if (rows.length === 0) return null;
        const user = rows[0];
        if (user.Estado !== 1 || !user.Contraseña) return null;
        const isValid = await bcrypt.compare(
          credentials.password,
          user.Contraseña
        );
        if (!isValid) return null;

        return {
          id:    user.IdUsuario,
          name:  `${user.Nombre} ${user.Apellido}`,
          email: user.Correo,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/publica/login",
    error:  "/publica/unauthorized" // aquí puedes manejar errores de dominio
  },

  callbacks: {
    /** → Este callback corre tanto en OAuth (Google) como en Credentials.  */
    async signIn({ user }) {
      // user.email siempre existe tras Google o Credenciales
      if (user.email!.endsWith("@upqroo.edu.mx")) {
        return true;
      }
      // rechaza el login y redirige a /publica/unauthorized
      return "/publica/unauthorized";
    },

    /** Asegúrate luego de seguir inyectando rol como ya tienes */
    async jwt({ token, user }) {
      if (user) token.email = user.email;
      if (token.email) {
        const pool = await getConnection();
        const [rows] = await pool.query<{ Rol: string }[]>(
          "SELECT Rol FROM Usuarios WHERE Correo = ?",
          [token.email]
        );
        if (rows.length) token.role = rows[0].Rol;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id   = token.id as number;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
