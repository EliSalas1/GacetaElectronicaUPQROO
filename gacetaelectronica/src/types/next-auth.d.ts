
// Eliminar la importación no utilizada
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

// Añadir esta importación si DefaultUser se sigue utilizando
import { DefaultUser } from "next-auth";
