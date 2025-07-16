"use client"

import { useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CategorySection from "@/components/CategoriasComponents/categorySection"
import { articlesData } from "@/components/CategoriasComponents/articlesMock"
import ButtomUp from "@/components/CategoriasComponents/ButtomUp"
import SearchBar from "@/components/HomeComponents/SearchBar"

export default function CategoriasPage() {
  // Estado para llevar el control de qué categorías están expandidas
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  // Función que alterna el estado expandido/colapsado de una categoría específica
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  return (
    // Contenedor principal
    <div className="min-h-screen bg-neutral-50">
      <Header />
      {/* Título principal de la página */}
      <div className="max-w-[1280px] mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-accent-900">Categorías</h1>

        <div className="mb-4">
        <SearchBar />
        </div>

        {/* Renderiza un botón para cada categoría */}
        
        {/* Renderiza una sección por cada categoría con sus artículos */}
        {Object.entries(articlesData).map(([categoryKey, articles]) => (
          <CategorySection
            key={categoryKey}
            categoryKey={categoryKey}
            articles={articles}
            isExpanded={!!expandedCategories[categoryKey]}
            onToggle={toggleCategory}
          />
        ))}
      </div>
      
      <ButtomUp />
      <Footer />
    </div>
  )
}
