// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Queremos proteger todo /private/*
  if (pathname.startsWith("/private")) {
    // 1) ¿Hay token de sesión?
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      // No autenticado → al login
      const url = req.nextUrl.clone();
      url.pathname = "/publica/login";
      return NextResponse.redirect(url);
    }
    // 2) ¿Rol permitido?
    const role = token.role as string | undefined;
    if (role !== "Admin" && role !== "Revisor") {
      // Autenticado pero sin permisos → a página “no autorizado” o home
      const url = req.nextUrl.clone();
      url.pathname = "/"; // crea esta ruta si quieres
      return NextResponse.redirect(url);
    }
  }
  // para todo lo demás, sigue normal
  return NextResponse.next();
}

export const config = {
  matcher: ["/private/:path*"],
};
