// src/app/publica/login/page.tsx
"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSessionUser } from "@/hooks/useSessionUser";
import GoogleButton from "@/components/Sign-in-up/GoogleButton";
import AuthForm from "@/components/Sign-in-up/AuthForm";
import SidePanel from "@/components/Sign-in-up/SidePanel";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const { userInfo, loading } = useSessionUser();
  const router = useRouter();

  // Si ya estás autenticado por cualquier método, redirige a "/"
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  // Mientras carga la sesión, no renderizamos nada
  if (status === "loading" || (status === "authenticated" && loading)) {
    return null;
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen py-2"
      style={{ backgroundColor: "var(--color-fondo)" }}
    >
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
          <div className="w-3/5 p-5">
            <div className="py-10">
              <h2
                className="text-3xl font-bold mb-2"
                style={{ color: "var(--color-vino)" }}
              >
                Iniciar Sesión
              </h2>
              <div
                className="border-2 w-10 inline-block mb-2"
                style={{ borderColor: "var(--color-naranja)" }}
              />
              <GoogleButton />
              <p className="text-gray-400 my-3">
                Usa tu cuenta institucional para acceder
              </p>
              <AuthForm type="login" />
            </div>
          </div>
          <SidePanel type="login" />
        </div>
      </main>
    </div>
  );
}
