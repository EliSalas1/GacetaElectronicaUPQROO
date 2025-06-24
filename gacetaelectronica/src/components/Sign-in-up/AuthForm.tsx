import { FaUser, FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import Link from "next/link";

interface Props {
  type?: "login" | "signup";
}

export default function AuthForm({ type = "login" }: Props) {
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
            className="bg-gray-100 outline-none text-sm flex-1"
          />
        </div>

        <div className="bg-gray-100 w-full max-w-xs p-2 flex items-center mb-3 rounded-[var(--radius)]">
          <FaUser className="text-gray-400 m-2" />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
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
          className="bg-gray-100 outline-none text-sm flex-1"
        />
      </div>

      <div className="bg-gray-100 w-full max-w-xs p-2 flex items-center mb-6 rounded-[var(--radius)]">
        <MdLockOutline className="text-gray-400 m-2" />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          className="bg-gray-100 outline-none text-sm flex-1"
        />
      </div>

      <a href="#" className="btn-signin mb-4">
        {type === "signup" ? "Registrarse" : "Iniciar sesión"}
      </a>

      {type === "login" && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          ¿No estás registrado?{" "}
          <Link href="/publica/signup" className="text-[var(--color-vino)] font-semibold hover:underline">
            Regístrate aquí
          </Link>
        </p>
      )}

      {type === "signup" && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/publica/login" className="text-[var(--color-vino)] font-semibold hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      )}
    </div>
  );
}
