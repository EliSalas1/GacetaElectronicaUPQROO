"use client";

import { useState } from "react";
import { useBusquedaArticulos } from "@/hooks/useBusquedaArticulos";
import SearchResults from "./SearchResults";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const { resultados, showResults } = useBusquedaArticulos(query);

  return (
    <section className="py-6 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-4 relative">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar artículos, autores..."
              className="w-full pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <SearchResults resultados={resultados} show={showResults} />
          </div>
          <button
            onClick={() => setQuery("")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md"
          >
            Limpiar
          </button>
        </div>
      </div>
    </section>
  );
}
