"use client";

import { useEffect, useState } from "react";
import SkeletonSchema from "@/components/SkeletonSchema";
import Image from "next/image";

interface Article {
  id: number;
  title: string;
  resumen: string;
  createdAt: string;
  category: string;
  author?: string;
  imagenUrl?: string | null;
}

interface Usuario {
  idUsuarios: number;
  Nombre: string;
  Apellido?: string;
}

function getDriveImageUrl(driveUrl: string): string | null {
  const regex = /\/d\/([a-zA-Z0-9_-]+)/;
  const match = driveUrl.match(regex);
  return match
    ? `https://drive.google.com/uc?export=preview&id=${match[1]}`
    : null;
}

export default function HomeCarousel() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const staticSlide = {
    id: 0,
    category: "Información",
    title: "¡Súmate a la Gaceta Universitaria UPQROO!",
    resumen:
      "Convocatoria abierta para que estudiantes y docentes participen en la Gaceta Universitaria UPQROO.",
    createdAt: new Date().toLocaleDateString(),
    author: "Gaceta Electrónica",
    imagenUrl: getDriveImageUrl(
      "https://drive.google.com/file/d/1Ssyr7tHtrzwc7Mb88Kg_iVSlxp_1y0IW/view?usp=sharing"
    ),
  };

  const allSlides = [staticSlide, ...articles];

  useEffect(() => {
    async function fetchArticlesAndAuthorsAndImages() {
      try {
        setLoading(true);
        // Ahora no usa cache para que siempre traiga datos frescos
        const res = await fetch("/api/articulosPublicados?limit=4", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Error al obtener artículos");
        const data: Article[] = await res.json();

        const articlesWithDetails = await Promise.all(
          data.map(async (article) => {
            const resUsers = await fetch(
              `/api/articuloUsuario?articuloId=${article.id}`
            );
            if (!resUsers.ok) throw new Error("Error al obtener autores");
            const users: Usuario[] = await resUsers.json();
            const authorName =
              users.length > 0
                ? `${users[0].Nombre} ${users[0].Apellido ?? ""}`.trim()
                : "Sin autor";

            const resRecursos = await fetch(
              `/api/recursos?articuloId=${article.id}`
            );
            const recursos = resRecursos.ok ? await resRecursos.json() : [];
            const imagenUrl =
              Array.isArray(recursos) && recursos.length > 0
                ? getDriveImageUrl(
                    recursos[0].Ruta || recursos[0].ruta || recursos[0].url || ""
                  )
                : null;

            return {
              ...article,
              author: authorName,
              imagenUrl,
            };
          })
        );

        setArticles(articlesWithDetails);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticlesAndAuthorsAndImages();
  }, []);

  useEffect(() => {
    if (articles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === allSlides.length - 1 ? 0 : prev + 1
      );
    }, 7000);
  return () => clearInterval(interval);
}, [allSlides.length, articles.length]);

  if (loading) {
    return <SkeletonSchema grid={1} variant="carousel" />;
  }

  

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative overflow-hidden">
        <div className="bg-white rounded-md shadow-sm overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out w-full"
            style={{
              width: `${allSlides.length * 100}%`,
              transform: `translateX(-${
                currentSlide * (100 / allSlides.length)
              }%)`,
            }}
          >
            {allSlides.map((item, index) => (
              <div
                key={item.id}
                className="w-full md:flex flex-shrink-0 flex-col md:flex-row"
                style={{ width: `${100 / allSlides.length}%` }}
              >
                <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
                  <span className="inline-block px-2 py-1 rounded-full text-xs mb-2 bg-gray-200 text-black w-fit">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                    {item.resumen}
                  </p>
                  <div className="text-xs text-gray-500 mb-3">
                    A. {item.author} • {item.createdAt}
                  </div>
                  {index !== 0 && (
                    <a
                      href={`/publica/articulo/${item.id}`}
                      className="inline-block bg-white text-[#4C0000] border border-[#4C0000] hover:bg-[#4C0000] hover:text-white cursor-pointer px-3 py-1.5 rounded text-sm transition-colors duration-300 w-fit"
                    >
                      Leer más
                    </a>
                  )}
                </div>
                <div className="w-full md:w-1/2 bg-gray-200 min-h-[200px] flex items-center justify-center relative">
                  {item.imagenUrl ? (
                    <Image
                      src={item.imagenUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gray-400 rounded-full" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4 space-x-1">
        {allSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "bg-orange-500 scale-105"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
            aria-label={`Ir a la noticia ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
