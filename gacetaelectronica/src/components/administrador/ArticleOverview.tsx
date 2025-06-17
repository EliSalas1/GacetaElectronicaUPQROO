"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArticleInterface } from "@/entities/article"
import { EditArticleDialog } from "./EditArticleDialog"
import { DeleteArticleDialog } from "./DeleteArticleDialog"

const allArticles = [
  {
    id: 1,
    title: "Nueva investigación en biotecnología",
    author: "María González",
    category: "investigaciones",
    status: "published",
    createdAt: "2024-01-15",
    publishedAt: "2024-01-16",
  },
  {
    id: 2,
    title: "Evento cultural de fin de año",
    author: "Carlos Rodríguez",
    category: "eventos",
    status: "pending",
    createdAt: "2024-01-14",
    publishedAt: null,
  },
  {
    id: 3,
    title: "Convocatoria para becas de estudio",
    author: "Ana Martínez",
    category: "convocatorias",
    status: "rejected",
    createdAt: "2024-01-13",
    publishedAt: null,
  },
  {
    id: 4,
    title: "Proyecto de sostenibilidad ambiental",
    author: "Luis Pérez",
    category: "proyectos",
    status: "draft",
    createdAt: "2024-01-12",
    publishedAt: null,
  },
  {
    id: 5,
    title: "Conferencia sobre inteligencia artificial",
    author: "Carmen López",
    category: "eventos",
    status: "published",
    createdAt: "2024-01-11",
    publishedAt: "2024-01-12",
  },
] satisfies Partial<ArticleInterface>[]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "published":
      return <Badge className="bg-green-100 text-green-800">Publicado</Badge>
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800">En Revisión</Badge>
    case "rejected":
      return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>
    case "draft":
      return <Badge variant="secondary">Borrado</Badge>
    default:
      return <Badge variant="outline">Desconocido</Badge>
  }
}

export default function ArticleOverview() {
  const router = useRouter()
  const [selectedArticle, setSelectedArticle] = useState<Partial<ArticleInterface> | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Todos los Artículos</CardTitle>
          <CardDescription>Vista general de todos los artículos en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha de Creación</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>{article.author}</TableCell>
                  <TableCell className="capitalize">{article.category.replace("-", " ")}</TableCell>
                  <TableCell>{getStatusBadge(article.status)}</TableCell>
                  <TableCell>{article.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => router.push(`administrador/articulo/${article.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedArticle(article)
                        setEditOpen(true)
                      }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedArticle(article)
                        setDeleteOpen(true)
                      }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <EditArticleDialog
        open={editOpen}
        onOpenChange={(value) => {
          setEditOpen(value)
          if (!value) setSelectedArticle(null)
        }}
        article={selectedArticle}
        onSave={(updatedArticle) => {
          // handle update logic here (API call or state update)
          console.log("Save article", updatedArticle)
        }}
      />

      <DeleteArticleDialog
        open={deleteOpen}
        onOpenChange={(value) => {
          setDeleteOpen(value)
          if (!value) setSelectedArticle(null)
        }}
        article={selectedArticle}
        onConfirm={() => {
          // handle delete logic here
          console.log("Deleted article:", selectedArticle?.id)
          setDeleteOpen(false)
        }}
      />
    </>
  )
}
