"use client";

import { Articulo } from "@/hooks/useBusquedaArticulos";
import { useRouter } from "next/navigation";

export default function SearchResults({
  resultados,
  show,
}: {
  resultados: Articulo[];
  show: boolean;
}) {
  const router = useRouter();

  const handleRedirect = (id: number) => {
    router.push(`/articulo/${id}`);
  };

  if (!show) return null;

  return (
    <div className="absolute left-0 right-0 mt-2 bg-white shadow-lg rounded-md border max-h-80 overflow-y-auto z-50">
      {resultados.length > 0 ? (
        resultados.map((art) => (
          <div
            key={art.idArticulo}
            onClick={() => handleRedirect(art.idArticulo)}
            className="px-4 py-2 hover:bg-orange-100 cursor-pointer transition"
          >
            <p className="font-medium">{art.Titulo}</p>
            <p className="text-sm text-gray-600">Autor: Redacción J-UP</p>
          </div>
        ))
      ) : (
        <div className="px-4 py-2 text-sm text-gray-600">Sin resultados.</div>
      )}
    </div>
  );
}
