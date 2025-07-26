"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

// Función que determina el color según la etiqueta
function getTagColor(tag: string): string {
  switch (tag) {
    case "Arte PUT":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "ArticuloAcademico":
      return "bg-green-100 text-green-800 border-green-200"
    case "ArticuloDifusion":
      return "bg-red-100 text-red-800 border-emerald-200"
    case "NotaSocial":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "Historieta":
      return "bg-pink-100 text-pink-800 border-pink-200"
    case "RelatoCorto":
      return "bg-orange-100 text-orange-800 border-indigo-200"
    case "Logro":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    default:
      return "bg-gray-200 text-gray-700 border-gray-300"
  }
}

// Componente que representa una tarjeta visual para mostrar información resumida de un artículo
export default function ArticleCard({ article }: { article: any }) {
  return (
    <Link href={`/publica/articulo/${article.id}`} passHref>
    <Card className="h-full flex flex-col justify-between hover:shadow-lg transition-shadow bg-neutral-50 border-neutral-200 hover:border-orange-500 cursor-pointer">
        <div className="relative">
            <Image
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            width={300}
            height={200}
            className="w-full h-48 object-cover rounded-t-lg"
            />
        </div>

        {/* Cabecera de la tarjeta con la etiqueta, fecha, título y autor */}        
        <CardHeader>
          <div className="flex flex-wrap gap-2 mb-2 items-center justify-between">
            {/* Etiquetas */}
            <div className="flex flex-wrap gap-2">
              {Array.isArray(article.etiquetas) && article.etiquetas.length > 0 ? (
                article.etiquetas.map((etiqueta: string, idx: number) => (
                  <Badge
                    key={idx}
                    className={`${tagColors[etiqueta as keyof typeof tagColors] || "bg-gray-100 text-gray-800 border-gray-200"} border`}
                  >
                    {etiqueta}
                  </Badge>
                ))
              ) : (
                <Badge className="bg-gray-100 text-gray-800 border-gray-200 border">Sin etiqueta</Badge>
              )}
            </div>
            <span className="text-sm text-neutral-500">{article.date}</span>
          </div>
          <CardTitle className="text-lg text-accent-900">{article.title}</CardTitle>
          <CardDescription className="text-sm text-neutral-600">Por {article.author}</CardDescription>
        </CardHeader>
          <CardContent className="mt-auto">
            <p className="text-neutral-700 line-clamp-3">{article.summary}</p>
          </CardContent>
        </Card>
      </Link>
  )
}
