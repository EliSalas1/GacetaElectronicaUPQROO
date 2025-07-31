"use client";

import { Button } from "@/components/ui/button";
import ArticleCard from "@/components/CategoriasComponents/articleCards";

const categoryTitles = {
  ciencia: "Ciencia y Tecnología",
  humanidades: "Humanidades",
  social: "Social y Política",
  logros: "Logros",
  culturales: "Cultura y Deporte",
};

// Componente que muestra una sección de artículos agrupados por categoría
export default function CategorySection({
  categoryKey,
  articles,
  isExpanded,
  onToggle,
}: {
  categoryKey: string;
  articles: any[];
  isExpanded: boolean;
  onToggle: (key: string) => void;
}) {
  const displayedArticles = isExpanded ? articles : articles.slice(0, 3);

  return (
    <section className="mb-16">
      {/* Título de la sección con botón para expandir/colapsar */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-accent-900">
          {categoryTitles[categoryKey as keyof typeof categoryTitles]}
        </h2>

        {/* Botón para expandir/colapsar la sección solo si hay más de 3 artículos */}
        {articles.length > 3 && (
          <Button
            variant="outline"
            onClick={() => onToggle(categoryKey)}
            className="px-6 py-2 border-[#4c0000] text-[#4c0000] bg-white hover:bg-[#4c0000] hover:text-white"
          >
            {isExpanded ? "Ver menos" : "Ver más"}
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ease-in-out">
        {displayedArticles.map((article, index) => (
          <div
            key={article.id}
            className={`${index >= 3 && isExpanded ? "animate-in slide-in-from-bottom-4 duration-500" : ""}`}
          >
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
