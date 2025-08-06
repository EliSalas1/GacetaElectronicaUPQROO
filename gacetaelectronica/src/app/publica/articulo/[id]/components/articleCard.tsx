"use client";
import React, { useEffect, useMemo, useState } from "react";
import { FiUser, FiCalendar, FiTag } from "react-icons/fi";
import Image from "next/image";

interface ArticleCardProps {
  article: any;
}

// Convierte URL de Google Drive en URL de visualización directa
function getDriveImageUrl(driveUrl: string): string | null {
  const regex = /\/d\/([a-zA-Z0-9_-]+)/;
  const match = driveUrl.match(regex);
  return match
    ? `https://drive.google.com/uc?export=view&id=${match[1]}`
    : null;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Genera URLs de imágenes desde el recurso
  const imageUrls = useMemo(() => {
    if (Array.isArray(article.Recursos)) {
      return article.Recursos.map(getDriveImageUrl).filter(Boolean) as string[];
    } else if (typeof article.Recursos === "string") {
      const posibles = article.Recursos.split(",").map((s: string) => s.trim());
      return posibles.map(getDriveImageUrl).filter(Boolean) as string[];
    }
    return [];
  }, [article.Recursos]);

  // Lógica del carrusel
  useEffect(() => {
    if (imageUrls.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [imageUrls]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 max-w-4xl w-full mx-auto">
      {/* Categoría */}
      <div className="mb-4">
        <span
          className="inline-flex items-center justify-center bg-gray-100 text-gray-700 rounded-full"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: 12,
            height: 24,
            padding: "0 20px",
            minWidth: 100,
          }}
        >
          {article.Categoria || "Sin categoría"}
        </span>
      </div>

      {/* Título */}
      <h1
        className="mb-2"
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: 36,
          lineHeight: 1.1,
          color: "#222",
        }}
      >
        {article.Titulo || "Sin título"}
      </h1>

      {/* Subtítulo */}
      <h2
        className="mb-6 text-justify"
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: 20,
          color: "#5e5e5eff",
          whiteSpace: "pre-line",
        }}
      >
        {article.Resumen || ""}
      </h2>

      {/* Autor y fecha */}
      <div className="flex flex-wrap gap-6 items-center mb-6">
        <div
          className="flex items-center gap-2 text-[#918B8B]"
          style={{ fontFamily: "Inter, sans-serif", fontSize: 14 }}
        >
          <FiUser />
          <span>{article.Autor || "Sin autor"}</span>
        </div>
        <div
          className="flex items-center gap-2 text-[#918B8B]"
          style={{ fontFamily: "Inter, sans-serif", fontSize: 14 }}
        >
          <FiCalendar />
          <span>{article.createdAt || ""}</span>
        </div>
      </div>

      {/* Etiquetas */}
      <div className="flex flex-wrap gap-3 mb-8">
        {(typeof article.Etiqueta === "string"
          ? article.Etiqueta.split(",")
          : ["No se encuentran etiquetas"]
        ).map((tag: string, idx: number) => (
          <span
            key={idx}
            className="flex items-center border border-black rounded-full bg-white text-black font-bold"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 11,
              height: 24,
              padding: "0 14px",
              lineHeight: "24px",
            }}
          >
            <FiTag className="mr-1 text-xs" />
            {tag}
          </span>
        ))}
      </div>

      {/* Carrusel sin botones */}
        <div className="w-full h-[276px] bg-white rounded-xl overflow-hidden mb-4 relative flex items-center justify-center">
      <Image
        src={
          imageUrls[currentImageIndex] ||
          "https://dummyimage.com/800x276/f97316/ffffff.png&text=Imagen+no+disponible"
        }
        alt={`Imagen ${currentImageIndex + 1}`}
        fill
        className="object-contain transition-all duration-300"
        sizes="(max-width: 768px) 100vw, 800px"
        style={{ padding: "0.5rem", objectPosition: "center" }}
      />
    </div>


      {/* Dots indicadores */}
      {imageUrls.length > 1 && (
        <div className="flex justify-center mb-8 gap-2">
          {imageUrls.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentImageIndex === index
                  ? "bg-orange-500 scale-110"
                  : "bg-gray-400 hover:bg-gray-500"
              }`}
              aria-label={`Imagen ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Contenido principal */}
      <div
        className="text-gray-700 leading-relaxed space-y-4 text-justify"
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: 16,
          whiteSpace: "pre-line",
        }}
      >
        {article.Contenido || "No hay contenido disponible"}
      </div>
    </div>
  );
};

export default ArticleCard;
