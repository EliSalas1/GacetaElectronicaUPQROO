import React from "react";
import { FiUser, FiCalendar, FiTag } from "react-icons/fi";
import Image from "next/image";

interface ArticleCardProps {
  article: any;
}
function getDriveImageUrl(driveUrl: string): string | null {
  const regex = /\/d\/([a-zA-Z0-9_-]+)/;
  const match = driveUrl.match(regex);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return null;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const urlDirecta = article.Recursos ? getDriveImageUrl(article.Recursos) ?? article.Recursos : null;
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
        className="mb-6"
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: 20,
          color: "#918B8B",
        }}
      >
        {article.Resumen || ""}
      </h2>

      {/* Autor y fecha */}
      <div className="flex flex-wrap gap-6 items-center mb-6">
        <div className="flex items-center gap-2 text-[#918B8B]" style={{ fontFamily: "Inter, sans-serif", fontSize: 14 }}>
          <FiUser />
          <span>{article.Autor || "Sin autor"}</span>
        </div>
        <div className="flex items-center gap-2 text-[#918B8B]" style={{ fontFamily: "Inter, sans-serif", fontSize: 14 }}>
          <FiCalendar />
          <span>{article.createdAt || ""}</span>
        </div>
      </div>

      {/* Etiquetas */}
      <div className="flex flex-wrap gap-3 mb-8">
        {(typeof article.Etiqueta === "string" ? article.Etiqueta.split(",") : ['No se encuentran etiquetas']).map((tag: string, idx: number) => (
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
      <div
      className="rounded-lg mb-8 flex items-center justify-center bg-gray-200 overflow-hidden"
      style={{
        width: "100%",
        minHeight: 200,
        maxHeight: 276,
        aspectRatio: "800/276",
      }}
    >
        {urlDirecta ? (
  <Image
  src={urlDirecta}
  alt="Imagen del artículo"
  width={800}
  height={276}
  style={{ objectFit: "cover", maxWidth: "100%", height: "auto" }}
/>

) : (
  <Image
    src="https://dummyimage.com/800x276/f97316/ffffff.png&text=Imagen+no+disponible"
    alt="Imagen no disponible"
    fill
    style={{ objectFit: "cover" }}
    sizes="100vw"
  />
        )}
    </div>
      {/* Contenido principal */}
      <div
        className="text-gray-700 leading-relaxed space-y-4"
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: 14,
        }}
      >
        {article.Contenido || "No hay contenido disponible"}

      </div>
    </div>
  );
};

export default ArticleCard;
