"use client";

import { useState } from "react";
import CategorySection from "@/components/CategoriasComponents/categorySection";
import SearchBar from "@/components/HomeComponents/SearchBar";
import LayoutCategorias from "@/components/CategoriasComponents/LayoutCategorias";
import useArticulosPorCategoria from "@/hooks/useArticulosPorCategoria";
import ArticleCardSkeleton from "@/components/CategoriasComponents/ArticleCardSkeleton";

export default function CategoriasPage() {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const { articlesByCategory, loading } = useArticulosPorCategoria();

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <LayoutCategorias>
      <h1 className="text-4xl font-bold text-center mb-12 text-accent-900">Categorías</h1>

      <div className="mb-4">
        <SearchBar />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <ArticleCardSkeleton key={index} />
          ))}
        </div>
      ) : Object.keys(articlesByCategory).length === 0 ? (
        <div className="text-center text-gray-600 mt-8">
          Artículos no encontrados.
        </div>
      ) : (
        Object.entries(articlesByCategory).map(([categoryKey, articles]) => (
          <CategorySection
            key={categoryKey}
            categoryKey={categoryKey}
            articles={articles}
            isExpanded={!!expandedCategories[categoryKey]}
            onToggle={toggleCategory}
          />
        ))
      )}
    </LayoutCategorias>
  );
}