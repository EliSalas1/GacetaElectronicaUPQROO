// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string;
      email?: string;
      image?: string;
      accessToken?: string;
      role?: string;
    };
  }

  interface User {
    role?: string;
  }

  interface Profile {
    given_name?: string;
    family_name?: string;
  }
}
