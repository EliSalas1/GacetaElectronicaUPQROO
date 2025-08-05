"use client";

import { useState } from "react";
import { FaUser, FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

interface Props {
  type?: "login" | "signup";
}

export default function AuthForm({ type = "login" }: Props) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre || !apellido || !email || !password) {
      toast.warning("Completa todos los campos para registrarte.");
      return;
    }

    const user = {
      Nombre: nombre,
      Apellido: apellido,
      Correo: email,
      Contraseña: password,
      Rol: "Usuario",
      Estado: 1,
    };

    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Usuario registrado con éxito");
        setNombre("");
        setApellido("");
        setEmail("");
        setPassword("");
      } else {
        toast.error(`Error al registrar: ${data.message || "Intenta más tarde"}`);
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warning("Completa todos los campos para iniciar sesión.");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      toast.success("Inicio de sesión exitoso");
      window.location.href = "/";
    } else {
      toast.error("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  return (
    <form
      onSubmit={type === "signup" ? handleSignup : handleLogin}
      className="flex flex-col items-center"
    >
      {type === "signup" && (
        <>
          <InputField
            icon={<FaUser className="text-gray-400 m-2" />}
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <InputField
            icon={<FaUser className="text-gray-400 m-2" />}
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </>
      )}

      <InputField
        icon={<FaRegEnvelope className="text-gray-400 m-2" />}
        placeholder="Correo electrónico"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <InputField
        icon={<MdLockOutline className="text-gray-400 m-2" />}
        placeholder="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit" className="btn-signin mb-4">
        {type === "signup" ? "Registrarse" : "Iniciar sesión"}
      </button>

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
    </form>
  );
}

function InputField({
  icon,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="bg-gray-100 w-full max-w-xs p-2 flex items-center mb-3 rounded-[var(--radius)]">
      {icon}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="bg-gray-100 outline-none text-sm flex-1"
      />
    </div>
  );
}