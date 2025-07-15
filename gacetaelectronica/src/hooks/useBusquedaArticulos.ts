"use client";

import { useEffect, useState } from "react";

/**
 * Representa la estructura de un artículo recibido desde la API.
 */
export type Articulo = {
  idArticulo: number;
  Titulo: string;
  Resumen: string;
  FechaCreacion: string;
  Estatus: number;
  Comentario: string;
  IdCategoria: number;
};

/**
 * Hook personalizado que realiza una búsqueda de artículos a partir de una consulta (`query`).
 * 
 * Este hook:
 * - Escucha los cambios en el valor de búsqueda (`query`)
 * - Consulta la API de artículos con un pequeño `debounce` (400ms)
 * - Filtra los resultados que coincidan con el título o autor (actualmente fijo como "Redacción J-UP")
 * - Devuelve los resultados, un indicador de carga (`loading`) y si se deben mostrar (`showResults`)
 * 
 * @param query - Texto de búsqueda ingresado por el usuario
 * @returns Un objeto con:
 * - `resultados`: arreglo de artículos filtrados
 * - `loading`: booleano que indica si la búsqueda está en curso
 * - `showResults`: booleano que indica si deben mostrarse los resultados
 */
export function useBusquedaArticulos(query: string) {
  const [resultados, setResultados] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResultados([]);
      setShowResults(false);
      return;
    }

    // Aplica debounce para evitar llamadas excesivas a la API
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/articulos?limit=100&offset=0");
        const data: Articulo[] = await res.json();

        // Filtro por coincidencia con el título o autor (temporalmente fijo)
        const filtrados = data.filter(
          (art) =>
            art.Titulo.toLowerCase().includes(query.toLowerCase()) ||
            "Redacción J-UP".toLowerCase().includes(query.toLowerCase())
        );

        setResultados(filtrados);
        setShowResults(true);
      } catch (err) {
        console.error("Error en búsqueda:", err);
        setResultados([]);
        setShowResults(true);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout); // Limpia timeout en cada cambio de query
  }, [query]);

  return { resultados, showResults, loading };
}
