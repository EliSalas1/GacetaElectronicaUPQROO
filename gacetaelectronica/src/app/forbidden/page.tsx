// src/app/forbidden/page.tsx

import React from 'react';
import Link from 'next/link';

const ForbiddenPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">¡Acceso Denegado!</h1>
        <p className="mt-4 text-lg text-gray-700">
          No tienes permiso para acceder a esta página. Si crees que esto es un error, por favor contacta al administrador.
        </p>
        <Link href="/" passHref>
          <button className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Volver al Inicio
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ForbiddenPage;
