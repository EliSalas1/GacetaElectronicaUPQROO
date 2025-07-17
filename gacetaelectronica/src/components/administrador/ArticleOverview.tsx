"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import { ArticleInterface } from "@/entities/article"
import { EditArticleDialog } from "./EditArticleDialog"
import { DeleteArticleDialog } from "./DeleteArticleDialog"
import EventOverview from "./EventsOverview"
import { ViewArticleDialog } from "./ViewArticleDialog"
import FilterSearchBar from "../FilterSearchBar"
import { useFetch } from "@/hooks/useFetch"
import { Spinner } from "../Spinner"
import { Pagination } from "../Pagination"

const getStatusBadge = (status: number) => {
  switch (status) {
    case 1:
      return <Badge className="bg-green-100 text-green-800">Publicado</Badge>
    case 2:
      return <Badge className="bg-yellow-100 text-yellow-800">En Revisión</Badge>
    case 3:
      return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>
    case 4:
      return <Badge variant="secondary">Borrado</Badge>
    default:
      return <Badge variant="outline">Desconocido</Badge>
  }
}

export default function ArticleOverview() {
  const [selectedArticle, setSelectedArticle] = useState<Partial<ArticleInterface> | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)

  const { data, loading } = useFetch<ArticleInterface>('/api/articulos')

  return (
    <main className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex justify-between">
          <div>
            <CardTitle>Todos los Artículos</CardTitle>
            <CardDescription>Vista general de todos los artículos en el sistema</CardDescription>
          </div>
          <div>
            <FilterSearchBar
              searchValue={""}
              onSearchChange={() => {}}
              filterBy={""}
              onFilterByChange={() => {}}
              filterValue={""}
              onFilterValueChange={() => {}}
              availableFields={[
                { label: "Categoría", value: "category" },
                { label: "Estado", value: "status" },
                { label: "Fecha", value: "createdAt" }
              ]}
              getFilterValues={(field) => []}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Resumen</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha de Creación</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={6} className="text-center flex justify-center"><Spinner/></TableCell></TableRow> : ""}
              {Array.isArray(data) && data.map((article) => (
                <TableRow key={article.idArticulo}>
                  <TableCell className="font-medium">{article.Titulo}</TableCell>
                  <TableCell>{article.Resumen}</TableCell>
                  <TableCell className="capitalize">{article.IdCategoria}</TableCell>
                  <TableCell>{getStatusBadge(article.Estatus)}</TableCell>
                  <TableCell>{article.FechaCreacion}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedArticle(article)
                          setViewOpen(true)
                        }}
                      >
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
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}>
                  <Pagination
                    page={1}
                    onPageChange={() => {}}
                    totalItems={100}
                  />
                </TableCell>
              </TableRow>
            </TableFooter>
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
          console.log("Deleted article:", selectedArticle?.IdCategoria)
          setDeleteOpen(false)
        }}
      />
      <ViewArticleDialog
        open={viewOpen}
        onOpenChange={(value) => {
          setViewOpen(value)
          if (!value) setSelectedArticle(null)
        }}
        article={selectedArticle}
      />
      <EventOverview />
    </main>
  )
}
