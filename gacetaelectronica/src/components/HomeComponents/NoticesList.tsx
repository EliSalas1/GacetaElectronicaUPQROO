import { allNotices } from "@/entities/article";
import { Home } from "@/entities/user";
import { ArrowRight } from "lucide-react";

//asigna un color dependiendo la categoria
function getCategoryColor(category: string): string {
  switch (category) {
    case "Ciencia y Tecnología":
      return "bg-blue-100 text-blue-800";
    case "Humanidades":
      return "bg-purple-100 text-purple-800";
    case "Logros":
      return "bg-yellow-100 text-yellow-800";
    case "Social y política":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-200 text-gray-700";
  }
}

export default function NoticesList() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {allNotices.map((news: Home) => (
        <div
          key={news.id}
          className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full"
        >
          {/* Imagen o placeholder */}
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-400 rounded" />
          </div>

          {/* Contenido */}
          <div className="p-6 flex flex-col flex-grow">
            <span
              className={`inline-flex max-w-fit text-xs px-2 py-1 rounded-full mb-3 font-medium ${getCategoryColor(
                news.category
              )}`}
            >
              {news.category}
            </span>

            <h3 className="font-bold text-lg mb-2 line-clamp-2">
              {news.title}
            </h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {news.content}
            </p>

            <div className="text-xs text-gray-500 mb-4 mt-auto">
              A. {news.author}
            </div>

            {Array.isArray(news.etiqueta) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {news.etiqueta.map((tag, i) => (
                  <span
                    key={i}
                    className="border border-gray-300 rounded px-2 py-1 text-xs max-w-xs truncate"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <a
              href={`#noticia-completa-${news.id}`}
              className="inline-flex items-center justify-center gap-2 w-full bg-[#4C0000] hover:bg-[#390000] text-white py-2 rounded text-sm font-medium transition"
            >
              Leer artículo completo
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
