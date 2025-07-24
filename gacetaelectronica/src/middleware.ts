import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/private")) {
    // 1) ¿Hay token de sesión?
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/publica/login";
      return NextResponse.redirect(url);
    }

    // 2) ¿Rol permitido?
    const role = token.role as string | undefined;
    
    if (role === "Admin" && pathname.startsWith("/private/administrador")) {
      return NextResponse.next();
    }

    if (role === "Revisor" && pathname.startsWith("/private/supervisor")) {
      return NextResponse.next();
    }

    if (role === "Autor" && pathname.startsWith("/private/redactor")) {
      return NextResponse.next();
    }

    const url = req.nextUrl.clone();
    url.pathname = "/forbidden"; // Si no tiene permisos, se redirige a forbidden
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/private/:path*"],
};
