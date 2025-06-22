"use client"

import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Eye, Trash2 } from "lucide-react"

const mockArticles = [
  {
    id: 1,
    title: "Nueva investigación en biotecnología",
    category: "investigaciones",
    status: "published",
    createdAt: "2024-01-15",
    publishedAt: "2024-01-16",
  },
  {
    id: 2,
    title: "Evento cultural de fin de año",
    category: "eventos",
    status: "pending",
    createdAt: "2024-01-14",
    publishedAt: null,
  },
  {
    id: 3,
    title: "Convocatoria para becas de estudio",
    category: "convocatorias",
    status: "pending",
    createdAt: "2024-01-13",
    publishedAt: null,
    feedback: "El contenido necesita más detalles sobre los requisitos",
  },
  {
    id: 4,
    title: "Proyecto de sostenibilidad ambiental",
    category: "proyectos",
    status: "rejected",
    createdAt: "2024-01-12",
    publishedAt: null,
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "published":
      return <Badge className="bg-green-100 text-green-800">Publicado</Badge>
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800">En Revisión</Badge>
    case "rejected":
      return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>
    // default:
    //   return <Badge variant="outline">Desconocido</Badge>
  }
}

export default function MyArticles() {
  const handleAction = (action: string, title: string) => {
    toast(`${action} artículo`, {
      description: `Acción "${action}" realizada en "${title}"`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mis Artículos</CardTitle>
        <CardDescription>Gestiona todos tus artículos creados</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockArticles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell className="capitalize">{article.category.replace("-", " ")}</TableCell>
                <TableCell>{getStatusBadge(article.status)}</TableCell>
                <TableCell>{article.createdAt}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleAction("Ver", article.title)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {(article.status === "rejected") && (
                      <Button variant="ghost" size="sm" onClick={() => handleAction("Editar", article.title)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {article.status === "rejected" && (
                      <Button variant="ghost" size="sm" onClick={() => handleAction("Eliminar", article.title)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
