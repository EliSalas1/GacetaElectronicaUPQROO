import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login"); // No autenticado
  }

  const { role } = session.user;
  const pathname = window.location.pathname; // Mover esta lógica al cliente (si es necesario)

  // Restricciones según el rol
  if (role === "Admin" && !pathname.startsWith("/private/administrador")) {
    redirect("/forbidden");
  }

  if (role === "Revisor" && !pathname.startsWith("/private/supervisor")) {
    redirect("/forbidden");
  }

  if (role === "Autor" && !pathname.startsWith("/private/redactor")) {
    redirect("/forbidden");
  }

  return <>{children}</>;
}
