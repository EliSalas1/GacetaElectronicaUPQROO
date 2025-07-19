"use client";

import { useEffect, useState } from "react";
import SkeletonSchema from "@/components/SkeletonSchema";

interface Article {
  id: number;
  title: string;
  resumen: string;
  createdAt: string;
  category: string;
  author?: string;
}

interface Usuario {
  idUsuarios: number;
  Nombre: string;
  Apellido?: string;
  Correo: string;
}

export default function HomeCarousel() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Contenido estático para el primer slide
  const staticSlide = {
    id: 0,
    category: "Información",
    title: "¡Súmate a la Gaceta Universitaria UPQROO!",
    resumen:
      "Convocatoria abierta para que estudiantes y docentes participen en la Gaceta Universitaria UPQROO.",
    createdAt: new Date().toLocaleDateString(),
    author: "Gaceta Electrónica",
  };

  useEffect(() => {
    async function fetchArticlesAndAuthors() {
      try {
        setLoading(true);
        const res = await fetch('/api/articulos?limit=4');
        if (!res.ok) throw new Error('Error al obtener artículos');
        const data: Article[] = await res.json();

        const articlesWithAuthors = await Promise.all(
          data.map(async (article) => {
            const resUsers = await fetch(`/api/articuloUsuario?articuloId=${article.id}`);
            if (!resUsers.ok) throw new Error('Error al obtener autores');
            const users: Usuario[] = await resUsers.json();

            const authorName = users.length > 0
              ? `${users[0].Nombre} ${users[0].Apellido ?? ''}`.trim()
              : "Sin autor";

            return {
              ...article,
              author: authorName,
            };
          })
        );

        setArticles(articlesWithAuthors);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticlesAndAuthors();
  }, []);

  useEffect(() => {
    if (articles.length === 0) return;
    // Cambiar sólo entre slides dinámicos (índices 1 a articles.length)
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev === articles.length) return 1;
        return prev + 1;
      });
    }, 7000);
    return () => clearInterval(interval);
  }, [articles]);

  if (loading) {
    return <SkeletonSchema grid={1} variant="carousel" />;
  }

  // Los slides son: [staticSlide, ...articles]
  const allSlides = [staticSlide, ...articles];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative overflow-hidden">
        <div className="bg-white rounded-md shadow-sm overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out w-full"
            style={{
              width: `${allSlides.length * 100}%`,
              transform: `translateX(-${currentSlide * (100 / allSlides.length)}%)`,
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
                  {/* Solo mostrar botón "Leer más" para slides dinámicos */}
                  {index !== 0 && (
                    <a
                      href={`#noticia-${item.id}`}
                      className="inline-block bg-[#4C0000] hover:bg-[#390000] text-white px-3 py-1.5 rounded text-sm transition w-fit"
                    >
                      Leer más
                    </a>
                  )}
                </div>
                <div className="w-full md:w-1/2 bg-gray-200 min-h-[200px] flex items-center justify-center">
                  <div className="w-14 h-14 bg-gray-400 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indicators */}
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
