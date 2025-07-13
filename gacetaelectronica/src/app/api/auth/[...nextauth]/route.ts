// api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import getConnection from "@/lib/db"; // Importa nuestra función de conexión a la base de datos

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // Redirige al login personalizado
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;

        // Conexión a la base de datos
        const pool = await getConnection();
        
        // Verificamos si el correo ya existe en la base de datos
        const [userExists] = await pool.query('SELECT * FROM Usuarios WHERE Correo = ?', [profile.email]);

        if (userExists.length === 0) {
          // Si el correo no existe, se puede insertar un nuevo usuario
          await pool.query(
            `INSERT INTO Usuarios (Nombre, Apellido, Correo, Rol, Estado, Contraseña, FechaCreacion)
             VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [profile.given_name, profile.family_name, profile.email, 'Usuario', 1, '', new Date()]
          );
        } else {
          // Aquí puedes agregar una verificación para limitar a 2 registros por correo
          if (userExists.length >= 2) {
            throw new Error("Este correo ya tiene el límite de registros alcanzado.");
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken; // Añadimos el access_token a la sesión
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`; // Redirigir a páginas internas
      return baseUrl; // Si la URL es externa, regresar al home
    },
  },
});

export { handler as GET, handler as POST };
