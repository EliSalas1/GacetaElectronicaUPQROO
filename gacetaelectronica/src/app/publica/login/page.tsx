"use client";

import { useSession, signOut } from "next-auth/react";
import { useSessionUser } from "@/hooks/useSessionUser"; // Asegúrate de que esta ruta es correcta
import GoogleButton from "@/components/Sign-in-up/GoogleButton";
import AuthForm from "@/components/Sign-in-up/AuthForm";
import SidePanel from "@/components/Sign-in-up/SidePanel";

export default function LoginPage() {
  const { data: session, status } = useSession(); // Usa useSession para obtener la sesión
  const { userInfo, loading } = useSessionUser(); // Usamos el hook para obtener la info del usuario

  if (status === "authenticated" && !loading) {
    // Si el usuario está logueado, muestra el nombre y un botón para cerrar sesión
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2" style={{ backgroundColor: "var(--color-fondo)" }}>
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
            <div className="w-3/5 p-5">
              <div className="py-10">
                <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--color-vino)" }}>
                  Bienvenido, {userInfo?.name}
                </h2>
                <div className="border-2 w-10 inline-block mb-2" style={{ borderColor: "var(--color-naranja)" }}></div>
                <p className="text-gray-400 my-3">Rol: {userInfo?.role}</p> {/* Muestra el rol del usuario */}
                <button 
                  onClick={() => signOut()} 
                  className="mt-4 bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-200"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
            <SidePanel type="login" />
          </div>
        </main>
      </div>
    );
  }

  // Si el usuario no está logueado, muestra el formulario de inicio de sesión
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2" style={{ backgroundColor: "var(--color-fondo)" }}>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
          <div className="w-3/5 p-5">
            <div className="py-10">
              <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--color-vino)" }}>Iniciar Sesión</h2>
              <div className="border-2 w-10 inline-block mb-2" style={{ borderColor: "var(--color-naranja)" }}></div>
              <GoogleButton />
              <p className="text-gray-400 my-3">Usa tu cuenta institucional para acceder</p>
              <AuthForm type="login" />
            </div>
          </div>
          <SidePanel type="login" />
        </div>
      </main>
    </div>
  );
}
