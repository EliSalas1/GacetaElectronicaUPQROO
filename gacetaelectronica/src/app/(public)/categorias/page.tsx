"use client"

import { useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CategorySection from "@/components/CategoriasComponents/categorySection"
import { articlesData } from "@/components/articlesMock"
import ButtomUp from "@/components/CategoriasComponents/ButtomUp"

export default function CategoriasPage() {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="max-w-[1280px] mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-accent-900">Categorías</h1>

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
