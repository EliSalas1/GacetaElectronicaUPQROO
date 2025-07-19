// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import getConnection from "@/lib/db";

export const authOptions: NextAuthOptions = {
  // 1) Proveedores
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    // Ajusta a la ruta donde esté tu login
    signIn: "/publica/login",
  },

  callbacks: {
    // 2) En el JWT almacenamos accessToken y role
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;

        // Conexión a BD
        const pool = await getConnection();
        const [rows] = await pool.query<[{ idUsuarios: number; Rol: string }]>(
          "SELECT idUsuarios, Rol FROM Usuarios WHERE Correo = ?",
          [profile.email]
        );

        if (rows.length === 0) {
          // Si no existe, lo insertamos como "Usuario"
          const insert = await pool.query<any>(
            `INSERT INTO Usuarios
               (Nombre, Apellido, Correo, Rol, Estado, Contraseña, FechaCreacion)
             VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [
              profile.given_name,
              profile.family_name,
              profile.email,
              "Usuario", // rol por defecto
              1,         // estado activo
              "",        // contraseña vacía para OAuth
            ]
          );
          // Si quieres, puedes leer el insertId aquí:
          // const newId = (insert as OkPacket).insertId;
          token.role = "Usuario";
        } else {
          // Ya existe, recuperamos el rol
          token.role = rows[0].Rol;
          // Y opcionalmente, limitamos a 2 registros por email:
          if (rows.length >= 2) {
            throw new Error("Este correo ya tiene el límite de registros alcanzado.");
          }
        }
      }
      return token;
    },

    // 3) En la sesión exponemos accessToken y role
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user = {
        ...session.user,
        role: token.role as string,
      };
      return session;
    },

    // 4) Control de redirecciones
    async redirect({ url, baseUrl }) {
      // Si es ruta interna, mantenla
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Si es externa, al home
      return baseUrl;
    },
  },
};

// 5) Exportar el handler para GET y POST
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
