// src/types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: number;               // Para login manual
      name?: string;
      email?: string;            // Para login con Google
      Correo?: string;           // Para login manual si usas 'Correo' en lugar de 'email'
      role?: string;
    };
  }

  interface User extends DefaultUser {
    id?: number;
    role?: string;
    Correo?: string;
  }

  interface JWT {
    accessToken?: string;
    id?: number;
    role?: string;
    Correo?: string;
  }
}
