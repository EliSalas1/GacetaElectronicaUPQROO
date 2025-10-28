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
  Contraseña: string;
  Rol: string;
  Estado: number;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Correo", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        const pool = await getConnection();
        const [rows] = await pool.query<UsuarioRow[]>(
          "SELECT * FROM Usuarios WHERE Correo = ?",
          [credentials.email]
        );

        if (rows.length === 0) {
          return null;
        }

        const user = rows[0];

        if (user.Estado !== 1 || !user.Contraseña) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.Contraseña
        );

        if (!isValid) return null;

        console.log(`Usuario logueado: ${user.Nombre} ${user.Apellido}, Rol: ${user.Rol}`);

        // Asigna el rol al user antes de devolverlo
        return {
          id: user.IdUsuario,
          id: user.IdUsuario,
          name: `${user.Nombre} ${user.Apellido}`,
          email: user.Correo,
          role: user.Rol, // Asegúrate de que el rol esté aquí
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/publica/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;  // Asegúrate de que el rol se guarda aquí
        console.log(`Rol asignado al token: ${token.role}`);
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as number;
        session.user.role = token.role as string;  // Asigna el rol a la sesión
        session.accessToken = token.accessToken as string;
        console.log(`Rol del usuario en la sesión: ${session.user.role}`);
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
