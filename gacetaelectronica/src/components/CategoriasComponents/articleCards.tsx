"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

// Mapa de colores personalizados para cada tipo de etiqueta (tag)
const tagColors = {
  "Artículo académico": "bg-blue-100 text-blue-800 border-blue-200",
  "Artículo de difusión": "bg-green-100 text-green-800 border-green-200",
  "Nota social": "bg-primary-100 text-primary-800 border-primary-200",
  Arte: "bg-purple-100 text-purple-800 border-purple-200",
  Historieta: "bg-pink-100 text-pink-800 border-pink-200",
  "Relato corto": "bg-indigo-100 text-indigo-800 border-indigo-200",
  Logro: "bg-yellow-100 text-yellow-800 border-yellow-200",
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
            <div className="flex justify-between items-start mb-2">
                <Badge className={`${tagColors[article.tag as keyof typeof tagColors]} border`}>
                    {article.tag}
                </Badge>
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