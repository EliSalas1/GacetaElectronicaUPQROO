import React from "react";
import { Home } from "@/entities/user";
import { FiUser, FiCalendar, FiTag } from "react-icons/fi";

interface ArticleCardProps {
  article: Home;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
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
          {article.category}
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
        {article.title}
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
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut venenatis lacus. Sed fermentum ut nisi vitae aliquet.
      </h2>
      {/* Autor y fecha */}
      <div className="flex flex-wrap gap-6 items-center mb-6">
        <div className="flex items-center gap-2 text-[#918B8B]" style={{ fontFamily: "Inter, sans-serif", fontSize: 14 }}>
          <FiUser />
          <span>{article.author}</span>
        </div>
        <div className="flex items-center gap-2 text-[#918B8B]" style={{ fontFamily: "Inter, sans-serif", fontSize: 14 }}>
          <FiCalendar />
          <span>{article.publishedAt}</span>
        </div>
      </div>
      {/* Etiquetas */}
      <div className="flex flex-wrap gap-3 mb-8">
        {article.etiqueta &&
          article.etiqueta.map((tag, idx) => (
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
      {/* Imagen o placeholder */}
      <div
        className="rounded-lg mb-8 flex items-center justify-center bg-gray-200"
        style={{
          width: "100%",
          minHeight: 200,
          maxHeight: 276,
          aspectRatio: "800/276",
        }}
      >
        {/* Aquí podrías poner una imagen si tuvieras el campo */}
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
        {article.content}
      </div>
    </div>
  );
};

export default ArticleCard;