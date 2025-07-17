"use client";

import { useEffect, useState } from "react";

/**
 * Tipo base que representa un artículo tal como lo devuelve la API.
 */
export type ArticuloAPI = {
  idArticulo: number;
  Titulo: string;
  Resumen: string;
  FechaCreacion: string;
  Estatus: number;
  Comentario: string;
  IdCategoria: number;
};

/**
 * Tipo transformado que representa un artículo como lo espera la UI (cards).
 */
export type ArticleCardProps = {
  id: number;
  title: string;
  summary: string;
  author: string;
  date: string;
  tag: string;
  image: string;
};

/**
 * Mapa que relaciona el IdCategoria de la API con la clave interna usada en la UI.
 * Este valor es usado para agrupar artículos por categoría textual.
 */
const CATEGORY_MAP: Record<number, string> = {
  1: "ciencia",
  2: "humanidades",
  3: "logros",
  4: "social",
  5: "culturales",
};

/**
 * Hook personalizado para obtener y agrupar artículos por categoría.
 *
 * - Realiza una petición a la API `/api/articulos`.
 * - Agrupa los artículos por categoría utilizando CATEGORY_MAP.
 * - Transforma los datos a un formato compatible con las tarjetas de artículo.
 *
 * @returns Un objeto con:
 *  - `articlesByCategory`: artículos agrupados por clave de categoría (ej. "ciencia", "logros", etc.)
 *  - `loading`: indica si los datos aún se están cargando
 */
export default function useArticulosPorCategoria() {
  const [articlesByCategory, setArticlesByCategory] = useState<Record<string, ArticleCardProps[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/articulos?limit=100&offset=0");
        const data: ArticuloAPI[] = await res.json();

        const grouped: Record<string, ArticleCardProps[]> = {};

        data.forEach((articulo) => {
          const key = CATEGORY_MAP[articulo.IdCategoria];
          if (!key) return; // Si no existe mapeo, ignorar el artículo

          const article: ArticleCardProps = {
            id: articulo.idArticulo,
            title: articulo.Titulo,
            summary: articulo.Resumen,
            author: "Redacción J-UP", // Por ahora es fijo
            date: new Date(articulo.FechaCreacion).toISOString().split("T")[0],
            tag: articulo.Estatus === 1 ? "Publicado" : "Borrador",
            image: "/placeholder.svg?height=200&width=300", // Imagen de ejemplo
          };

          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(article);
        });

        setArticlesByCategory(grouped);
      } catch (err) {
        console.error("Error al obtener artículos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  return { articlesByCategory, loading };
}
