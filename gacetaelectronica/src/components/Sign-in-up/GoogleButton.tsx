"use client";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";

export default function GoogleButton() {
  const handleGoogleSignIn = () => {
    signIn("google"); // Autenticación con Google usando NextAuth
  };

  return (
    <div className="flex justify-center my-4">
      <button
        onClick={handleGoogleSignIn}
        className="flex items-center border-2 border-gray-200 rounded-full px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <FaGoogle className="mr-2" />
        Continuar con Google
      </button>
    </div>
  );
}
