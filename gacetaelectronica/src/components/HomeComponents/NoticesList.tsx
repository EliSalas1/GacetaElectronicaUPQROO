"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SkeletonSchema from "@/components/SkeletonSchema";
import Image from "next/image";

interface Articulo {
  id: number;
  title: string;
  resumen: string;
  createdAt: string;
  status: string;
  category: string;
  author: string;
  etiqueta: string[];
  imagenUrl: string;
}
function getTagColor(tag: string): string {
  const normalizedTag = tag.trim().normalize(); // Elimina espacios/saltos y normaliza caracteres

  switch (normalizedTag) {
    case "Arte":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Artículo académico":
      return "bg-green-100 text-green-800 border-green-200";
    case "Artículo de difusión":
      return "bg-red-100 text-red-800 border-emerald-200";
    case "Nota social":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Historieta":
      return "bg-pink-100 text-pink-800 border-pink-200";
    case "Relato corto":
      return "bg-orange-100 text-orange-800 border-indigo-200";
    case "Logro":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-200 text-gray-700 border-gray-300";
  }
}


function getDriveImageUrl(driveUrl: string): string | null {
  const regex = /\/d\/([a-zA-Z0-9_-]+)/;
  const match = driveUrl.match(regex);
  return match ? `https://drive.google.com/uc?export=preview&id=${match[1]}` : null;
}

export default function NoticesList() {
  const [notices, setNotices] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/articulos?limit=10");
        if (!res.ok) throw new Error("Error al cargar artículos");
        const data = await res.json();

        const publicados = data.filter((a: any) => a.status === "published");
        const aleatorios = publicados.sort(() => 0.5 - Math.random()).slice(0, 4);

        const enriched = await Promise.all(
          aleatorios.map(async (articulo: any) => {
            const etiquetasRes = await fetch(
              `/api/articuloEtiqueta?articuloId=${articulo.id}`
            );
            const etiquetas = await etiquetasRes.json();

            const autorRes = await fetch(
              `/api/articuloUsuario?articuloId=${articulo.id}`
            );
            const autores = await autorRes.json();
            const author =
              Array.isArray(autores) && autores.length > 0
                ? `${autores[0].Nombre} ${autores[0].Apellido ?? ""}`.trim()
                : "Sin autor";

            const recursoRes = await fetch(
              `/api/recursos?articuloId=${articulo.id}`
            );
            const recursos = await recursoRes.json();
            const imagenUrl = Array.isArray(recursos) && recursos.length > 0
              ? getDriveImageUrl(recursos[0].Ruta)
              : null;

            console.log("Recurso", recursos[0]);


            return {
              id: articulo.id,
              title: articulo.title,
              resumen: articulo.resumen,
              createdAt: articulo.createdAt,
              status: articulo.status,
              category: articulo.category,
              author,
              etiqueta: etiquetas.map((e: any) => e.Nombre),
              imagenUrl,
            };
          })
        );

        setNotices(enriched);
      } catch (err: any) {
        setError(err.message || "Error al obtener artículos");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <>
      {loading && (
        <SkeletonSchema grid={4} variant="noticias" />
      )}

      {!loading && (
        <div className="grid md:grid-cols-2 gap-6">
          {notices.map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                {news.imagenUrl ? (
                  <Image
                    src={news.imagenUrl}
                    alt={news.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-400 rounded" />
                )}
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <span className="inline-flex max-w-fit text-xs px-2 py-1 rounded-full mb-3 font-medium bg-gray-200 text-gray-700">
                  {news.category}
                </span>

                <h3 className="font-bold text-lg mb-1 line-clamp-2">{news.title}</h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{news.resumen}</p>

                <div className="text-xs text-gray-500 mb-3 mt-auto">A. {news.author}</div>

                {Array.isArray(news.etiqueta) && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {news.etiqueta.map((tag, i) => (
                      <span
                        key={i}
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)} max-w-xs truncate`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <Button
                  asChild
                  variant="outline"
                  className="bg-white text-[#4C0000] border border-[#4C0000] hover:bg-[#4C0000] hover:text-white w-full transition"
                >
                  <a
                    href={`/publica/articulo/${news.id}`}
                    className="flex items-center justify-center gap-2"
                  >
                    Leer artículo completo
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
