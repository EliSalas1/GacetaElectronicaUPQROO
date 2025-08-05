"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

// Función que determina el color según la etiqueta



function getTagColor(tag: string): string {
  const normalizedTag = tag.trim().normalize()

  switch (normalizedTag) {
    case "Arte":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Artículo académico":
      return "bg-green-100 text-green-800 border-green-200"
    case "Artículo de difusión":
      return "bg-red-100 text-red-800 border-emerald-200"
    case "Nota social":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "Historieta":
      return "bg-pink-100 text-pink-800 border-pink-200"
    case "Relato corto":
      return "bg-orange-100 text-orange-800 border-indigo-200"
    case "Logro":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    default:
      return "bg-gray-200 text-gray-700 border-gray-300"
  }
}

function getDriveImageUrl(driveUrl?: string): string | null {
  if (!driveUrl || typeof driveUrl !== "string") return null;

  const regex = /\/d\/([a-zA-Z0-9_-]+)/;
  const match = driveUrl.match(regex);

  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }

  return null;
}

export default function ArticleCard({ article }: { article: any }) {
  const [author, setAuthor] = useState<string>("Autor desconocido")

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await fetch(`/api/articuloUsuario?articuloId=${article.id}`)
        const autores = await res.json()
        if (Array.isArray(autores) && autores.length > 0) {
          const nombre = autores[0].Nombre ?? ""
          const apellido = autores[0].Apellido ?? ""
          setAuthor(`${nombre} ${apellido}`.trim())
        }
      } catch (error) {
        console.error("Error al cargar autor:", error)
      }
    }

    fetchAuthor()
  }, [article.id])

  return (
    <Link href={`/publica/articulo/${article.id}`}>
  <Card className="h-full flex flex-col justify-between hover:shadow-lg transition-shadow bg-neutral-50 border-neutral-200 hover:border-orange-500 cursor-pointer">
    <div className="relative w-full h-[350px] bg-neutral-300 overflow-hidden rounded-t-lg">
  <Image
    src={
      getDriveImageUrl(article.Recursos) ||
      article.image ||
      "/placeholder.svg"
    }
    alt={article.title}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, 300px"
    style={{
      objectPosition: "center",
      backgroundColor: "#f3f4f6",
    }}
  />
</div>


    <CardHeader>
      <div className="flex flex-wrap gap-2 mb-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {Array.isArray(article.etiquetas) && article.etiquetas.length > 0 ? (
            article.etiquetas.map((etiqueta: string, idx: number) => (
              <Badge
                key={idx}
                className={`${getTagColor(etiqueta)} border`}
              >
                {etiqueta}
              </Badge>
            ))
          ) : (
            <Badge className="bg-gray-100 text-gray-800 border-gray-200 border">
              Sin etiqueta
            </Badge>
          )}
        </div>
        <span className="text-sm text-neutral-500">{article.date}</span>
      </div>
      <CardTitle className="text-lg text-accent-900">{article.title}</CardTitle>
      <CardDescription className="text-sm text-neutral-600">Por {author}</CardDescription>
    </CardHeader>

    <CardContent className="mt-auto">
      <p className="text-neutral-700 line-clamp-3">{article.summary}</p>
    </CardContent>
  </Card>
</Link>

  )
}
