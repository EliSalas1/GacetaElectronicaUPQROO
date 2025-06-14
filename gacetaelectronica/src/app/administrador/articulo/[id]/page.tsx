// app/articulo/[id]/page.tsx
import PrivateHeader from "@/components/PrivateHeader"
import { ArticleInterface } from "@/entities/article"
import { notFound } from "next/navigation"
import { BackButton } from "./BackButton"

interface PageProps {
  params: {
    id: string
  }
}

// Mock "database"
const mockArticles: ArticleInterface[] = [
  {
    id: 1,
    title: "La evolución del software libre",
    author: "Carlos Méndez",
    category: "Tecnología",
    state: "Publicado",
    createdAt: "2024-06-01",
    content:
      "El software libre ha evolucionado significativamente desde sus inicios en la década de 1980. Hoy en día, muchos proyectos críticos utilizan licencias abiertas...",
  },
  {
    id: 2,
    title: "Impacto del cambio climático en México",
    author: "Ana López",
    category: "Ciencia",
    state: "Publicado",
    createdAt: "2024-05-15",
    content:
      "Los efectos del cambio climático en México incluyen sequías prolongadas, aumento en la temperatura y fenómenos meteorológicos extremos...",
  },
]

export default async function ArticlePage({ params }: PageProps) {
  const id = parseInt(params.id)

  const article = await getArticleById(id)

  if (!article) {
    notFound()
  }

  return (
    <>
      <PrivateHeader/>
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <BackButton/>
        <h1 className="text-3xl font-bold">{article.title}</h1>
        <div className="text-sm text-muted-foreground">
          <span>Por {article.author} · </span>
          <span>Categoría: {article.category} · </span>
          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="prose dark:prose-invert">
          <p>{article.content}</p>
        </div>
      </div>
    </>
  )
}

async function getArticleById(id: number): Promise<ArticleInterface | null> {
  // Simulate async delay
  await new Promise((res) => setTimeout(res, 300))
  return mockArticles.find((article) => article.id === id) ?? null
}
