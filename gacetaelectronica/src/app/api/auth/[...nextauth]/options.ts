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
        // Verificar si el usuario ya existe en la base de datos
        const pool = await getConnection();
        const [existingUser] = await pool.query<UsuarioRow[]>(
          "SELECT * FROM Usuarios WHERE Correo = ?",
          [user.email]
        );

        if (existingUser.length === 0) {
          // Si el usuario no existe, insertarlo en la base de datos
          try {
            const firstName = user.name?.split(' ')[0] || "";
            const lastName = user.name?.split(' ')[1] || "";
            const [result] = await pool.query(
              "INSERT INTO Usuarios (Nombre, Apellido, Correo, Rol, Estado, Contraseña, FechaCreacion) VALUES (?, ?, ?, ?, ?, NULL, NOW())",
              [firstName, lastName, user.email, "Usuario", 1]
            );
            console.log(`Nuevo usuario insertado con id: ${(result as any).insertId}`);
          } catch (error) {
            console.error("Error al insertar usuario:", error);
            return "/publica/unauthorized";  // Retornar a la página de acceso no autorizado si hay error
          }
        }

        return true;  // Permitir el acceso
      }

      return "/publica/unauthorized";
    },

    /** 
     * Aquí inyectamos siempre el role desde DB,
     * tanto para Google (no trae role) como para Credentials 
     */
    async jwt({ token, user }) {
      if (user) {
        token.id    = user.id as number;
        token.email = user.email as string;
      }

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
