// components/Sign-in-up/AuthForm.tsx
"use client";
// components/Sign-in-up/AuthForm.tsx

import { useState } from "react";
import { FaUser, FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import Link from "next/link";
import { signIn } from "next-auth/react"; // Importar la función signIn para Google

interface Props {
  type?: "login" | "signup";
}

export default function AuthForm({ type = "login" }: Props) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Función para manejar el registro de usuario
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Los datos a enviar al backend
    const user = {
      Nombre: nombre,
      Apellido: apellido,
      Correo: email,
      Contraseña: password,
      Rol: "Usuario", // Por defecto, el rol podría ser 'Usuario', puedes cambiarlo según tus necesidades
      Estado: 1, // El estado puede ser 1 (activo) por defecto
    };

    // Enviar los datos del formulario al backend
    const res = await fetch("/api/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (res.ok) {
      alert("Usuario registrado con éxito");
    } else {
      alert("Error al registrar el usuario");
    }
  };

  // Función para manejar el inicio de sesión con Google
  const handleGoogleSignIn = () => {
    signIn("google"); // Usamos la autenticación de Google con NextAuth
  };

  return (
    <div className="flex flex-col items-center">
      {type === "signup" && (
        <>
          <div className="bg-gray-100 w-full max-w-xs p-2 flex items-center mb-3 rounded-[var(--radius)]">
            <FaUser className="text-gray-400 m-2" />
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="bg-gray-100 outline-none text-sm flex-1"
            />
          </div>

          <div className="bg-gray-100 w-full max-w-xs p-2 flex items-center mb-3 rounded-[var(--radius)]">
            <FaUser className="text-gray-400 m-2" />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="bg-gray-100 outline-none text-sm flex-1"
            />
          </div>
        </>
      )}

      <div className="bg-gray-100 w-full max-w-xs p-2 flex items-center mb-3 rounded-[var(--radius)]">
        <FaRegEnvelope className="text-gray-400 m-2" />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-100 outline-none text-sm flex-1"
        />
      </div>

      <div className="bg-gray-100 w-full max-w-xs p-2 flex items-center mb-6 rounded-[var(--radius)]">
        <MdLockOutline className="text-gray-400 m-2" />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-gray-100 outline-none text-sm flex-1"
        />
      </div>

      {type === "signup" ? (
        <button onClick={handleSignup} className="btn-signin mb-4">
          Registrarse
        </button>
      ) : (
        <button onClick={handleGoogleSignIn} className="btn-signin mb-4">
          Iniciar sesión con Google
        </button>
      )}

      {type === "login" && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          ¿No estás registrado?{" "}
          <Link
            href="/publica/signup"
            className="text-[var(--color-vino)] font-semibold hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      )}

      {type === "signup" && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/publica/login"
            className="text-[var(--color-vino)] font-semibold hover:underline"
          >
            Inicia sesión aquí
          </Link>
        </p>
      )}
    </div>
  );
}
