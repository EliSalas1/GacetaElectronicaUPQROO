"use client";
import { signIn } from "next-auth/react"; // Importa signIn para autenticación
import { FaGoogle } from "react-icons/fa";

export default function GoogleButton() {
  return (
    <div className="flex justify-center my-2">
      <button
        onClick={() => signIn("google")} // Utiliza la autenticación de Google con NextAuth
        className="border-2 border-gray-200 rounded-full p-3 mx-1"
      >
        <FaGoogle className="text-sm" />
      </button>
    </div>
  );
}
