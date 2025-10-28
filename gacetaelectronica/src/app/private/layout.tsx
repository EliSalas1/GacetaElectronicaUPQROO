// src/app/private/layout.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/publica/login"); // No autenticado
  }
  // Ya no chequeamos rutas aquí: el middleware se encarga
  return <>{children}</>;
}
