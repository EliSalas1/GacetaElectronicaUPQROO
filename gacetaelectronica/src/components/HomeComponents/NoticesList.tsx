import { allNotices } from "@/entities/article";
import { Home } from "@/entities/user";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Asigna un color dependiendo la etiqueta
function getTagColor(tag: string): string {
  switch (tag) {
    case "Artículo académico":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Artículo de difusión":
      return "bg-green-100 text-green-800 border-green-200";
    case "Nota social":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Arte":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Historieta":
      return "bg-pink-100 text-pink-800 border-pink-200";
    case "Relato corto":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "Logro":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-200 text-gray-700 border-gray-300";
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
            {/* Categoría en color neutro */}
            <span className="inline-flex max-w-fit text-xs px-2 py-1 rounded-full mb-3 font-medium bg-gray-200 text-gray-700">
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

            {/* ETIQUETAS CON COLOR */}
            {Array.isArray(news.etiqueta) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {news.etiqueta.map((tag, i) => (
                  <span
                    key={i}
                    className={`
                      inline-block
                      px-2 py-1
                      rounded-full
                      text-xs
                      font-medium
                      ${getTagColor(tag)}
                      max-w-xs truncate
                    `}
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
                href={`#noticia-completa-${news.id}`}
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
  );
}
