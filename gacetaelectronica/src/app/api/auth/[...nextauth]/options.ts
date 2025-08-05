// src/app/api/auth/[...nextauth]/options.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import getConnection from "@/lib/db";
import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";

interface UsuarioRow extends RowDataPacket {
  idUsuarios: number;
  Nombre:     string;
  Apellido:   string;
  Correo:     string;
  Contraseña: string | null;
  Rol:        string;
  Estado:     number;
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
        // dominio escolar obligatorio
        if (
          !credentials ||
          !credentials.email.endsWith("@upqroo.edu.mx") ||
          !credentials.password
        ) {
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

        console.log(
          `Credentials login → ${user.Nombre} ${user.Apellido}, Rol: ${user.Rol}`
        );

        return {
          id:    user.idUsuarios,
          name:  `${user.Nombre} ${user.Apellido}`,
          email: user.Correo,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/publica/login",
    error:  "/publica/unauthorized",
  },

  callbacks: {
    /** Limita el dominio de Google también */
    async signIn({ user }) {
      if (user.email && user.email.endsWith("@upqroo.edu.mx")) {
        return true;
      }
      return "/publica/unauthorized";
    },

    /** 
     * Aquí inyectamos siempre el role desde DB,
     * tanto para Google (no trae role) como para Credentials 
     */
    async jwt({ token, user }) {
      // 1) Si viene de Credentials, `authorize` devolvió un objeto con `id` y `email`
      if (user) {
        token.id    = user.id as number;
        token.email = user.email as string;
      }

      // 2) Si tenemos email y no tenemos role, lo traemos de la BD
      if (token.email && !token.role) {
        try {
          const pool = await getConnection();
          const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT Rol FROM Usuarios WHERE Correo = ?",
            [token.email]
          );
          if (rows.length > 0) {
            token.role = rows[0].Rol;
          }
        } catch (e) {
          console.error("JWT callback DB error:", e);
        }
      }

      console.log("JWT callback → token.role:", token.role);
      return token;
    },

    /**
     * Exponemos `role` en la sesión del cliente
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id   = token.id as number;
        session.user.role = token.role as string;
      }
      console.log("Session callback → session.user.role:", session.user.role);
      return session;
    },
  },
};