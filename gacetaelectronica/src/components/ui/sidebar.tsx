"use client";

import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botón hamburguesa (solo visible en móvil) */}
      <button
        className="md:hidden p-2 text-white"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Panel lateral derecho */}
      {open && (
        <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-4">
          <h2 className="text-lg font-semibold text-[#FF6400] mb-4">Opciones</h2>
          <ul className="space-y-3">
            <li>
              <Link
                href="/dashboard"
                className="block text-gray-800 hover:text-[#FF6400]"
                onClick={() => setOpen(false)}
              >
                Panel
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  setOpen(false);
                  console.log("Cerrar sesión");
                  // Aquí va tu lógica real de logout
                }}
                className="text-gray-800 hover:text-[#FF6400] w-full text-left"
              >
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
