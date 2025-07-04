"use client";

import { useEffect, useState } from "react";
import { featuredNotices } from "@/entities/article";

export default function HomeCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0); // Estado que guarda el índice de la diapositiva actual del carrusel

  useEffect(() => { // Efecto que se ejecuta una vez al montar el componente
    
    const interval = setInterval(() => { // Inicia un intervalo que actualiza el slide cada 7 segundos
      setCurrentSlide((prev) => (prev + 1) % featuredNotices.length); // Actualiza al siguiente slide. Si llega al final, vuelve al principio (ciclo circular)
    }, 7000);

    return () => clearInterval(interval); // Limpieza del intervalo cuando se desmonta el componente
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative overflow-hidden">
        <div className="bg-white rounded-md shadow-sm overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out w-full"
            style={{
              width: `${featuredNotices.length * 100}%`, // Ancho total del contenedor, en función del número de noticias
              transform: `translateX(-${ // Desplazamiento horizontal para mostrar solo el slide activo
                currentSlide * (100 / featuredNotices.length)
              }%)`,
            }}
          >
            {featuredNotices.map((item) => (
              <div
                key={item.id}
                className="w-full md:flex flex-shrink-0 flex-col md:flex-row"
                style={{ width: `${100 / featuredNotices.length}%` }} // Cada slide tiene un ancho proporcional al número total de slides
              >
                {/* Text content */}
                <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
                  <span className="inline-block px-2 py-1 rounded-full text-xs mb-2 bg-gray-200 text-black w-fit">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                    {item.content}
                  </p>
                  <div className="text-xs text-gray-500 mb-3">
                    A. {item.author} • {item.publishedAt}
                  </div>
                  <a
                    href={`#noticia-${item.id}`}
                    className="inline-block bg-[#4C0000] hover:bg-[#390000] text-white px-3 py-1.5 rounded text-sm transition w-fit"
                  >
                    Leer más
                  </a>
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
        {featuredNotices.map((_, index) => (
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
