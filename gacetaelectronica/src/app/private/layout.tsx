// src/app/private/layout.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");        // no autenticado
  if (session.user.role !== "Admin" && session.user.role !== "Revisor") {
    redirect("/forbidden");                 // sin permiso
  }
  return <>{children}</>;
}
