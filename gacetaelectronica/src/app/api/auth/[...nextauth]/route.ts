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

        return {
          id: user.IdUsuario, // Mantener como number
          name: `${user.Nombre} ${user.Apellido}`,
          email: user.Correo,
          role: user.Rol,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/publica/login",
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = (user as any).role; // role no forma parte de User por defecto
      }

      if (account?.provider === "google" && profile?.email) {
        const pool = await getConnection();

        const [existing] = await pool.query<UsuarioRow[]>(
          "SELECT * FROM Usuarios WHERE Correo = ?",
          [profile.email]
        );

        if (existing.length === 0) {
          await pool.query(
            `INSERT INTO Usuarios (Nombre, Apellido, Correo, Rol, Estado, Contraseña, FechaCreacion)
             VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [
              profile.given_name || "",
              profile.family_name || "",
              profile.email,
              "Usuario",
              1,
              "",
            ]
          );
        }

        token.accessToken = account.access_token;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as number;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
