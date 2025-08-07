import { Lock } from "lucide-react";
import Link from "next/link";

const ForbiddenPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4 relative">
      {/* Meta redirección */}
      <head>
        <meta httpEquiv="refresh" content="5;url=/" />
      </head>

      <Lock className="w-16 h-16 text-[var(--color-vino)] mb-4" />
      <h1 className="text-4xl font-bold text-[var(--color-vino)]">¡Acceso Denegado!</h1>
      <p className="mt-4 text-base text-gray-600 max-w-md">
        No tienes permiso para acceder a esta sección. Si crees que esto es un error, por favor contacta al administrador.
      </p>
      <p className="mt-4 text-base text-gray-600 max-w-md">
        Serás redirigido automáticamente en unos segundos o puedes volver al inicio con el botón.
      </p>

      <Link href="/" passHref>
        <button className="mt-6 px-6 py-2 bg-white text-[var(--color-vino)] border border-[var(--color-vino)] rounded-md hover:bg-[var(--color-vino)] hover:text-white transition-colors duration-300 cursor-pointer">
          Volver al Inicio
        </button>
      </Link>
    </div>
  );
};

export default ForbiddenPage;
