"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input"; // Asegúrate de importar Input
import { ArticleInterface } from "@/entities/article";
import { EditArticleDialog } from "./EditArticleDialog";
import { DeleteArticleDialog } from "./DeleteArticleDialog";
import { ViewArticleDialog } from "./ViewArticleDialog";
import { useFetch } from "@/hooks/useFetch";
import { Spinner } from "../Spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

const getStatusBadge = (status: number) => {
  switch (status) {
    case 1:
      return <Badge className="bg-green-100 text-green-800">Publicado</Badge>;
    case 2:
      return <Badge className="bg-yellow-100 text-yellow-800">En Revisión</Badge>;
    case 3:
      return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>;
    case 4:
      return <Badge variant="secondary">Borrado</Badge>;
    default:
      return <Badge variant="outline">Desconocido</Badge>;
  }
};

export default function ArticleOverview() {
  const [selectedArticle, setSelectedArticle] = useState<Partial<ArticleInterface> | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para la búsqueda
  const [filterBy, setFilterBy] = useState(""); // Filtro por categoría o estado
  const [filterValue, setFilterValue] = useState(""); // Valor del filtro

  const { data, loading } = useFetch<ArticleInterface>('/api/articulos');

  const filteredData = data?.filter((article) => {
    // Comprobación de que article.Titulo no sea undefined o null
    const matchesSearch = article.Titulo
      ? article.Titulo.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    
    const matchesFilter =
      (filterBy === "category" && filterValue === "all") ||
      (filterBy === "status" && filterValue === "all") ||
      (filterBy && article[filterBy] === filterValue);

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div>
            <CardTitle>Todos los Artículos</CardTitle>
            <CardDescription>
              Vista general de todos los artículos en el sistema
            </CardDescription>
          </div>

          {/* Filtros inline */}
          <div className="flex gap-2 w-full md:w-auto">
            {/* Input búsqueda */}
            <div className="relative w-full md:w-64">
              <Input
                className="pl-10"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtro por campo */}
            <Select
              value={filterBy}
              onValueChange={(value) => {
                setFilterBy(value);
                setFilterValue(""); // Reset valor cuando cambias el filtro
              }}
            >
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">Categoría</SelectItem>
                <SelectItem value="status">Estado</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro por valor */}
            <Select value={filterValue} onValueChange={setFilterValue}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filtrar valor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {(filterBy === "category"
                  ? ["1", "2"] // Pone los valores según tus categorías
                  : filterBy === "status"
                  ? ["1", "2"] // Pone los valores según tus estados
                  : []
                ).map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center flex justify-center">
                    <Spinner />
                  </TableCell>
                </TableRow>
              ) : (
                filteredData?.map((article) => (
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
                            setSelectedArticle(article);
                            setViewOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedArticle(article);
                            setEditOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedArticle(article);
                            setDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditArticleDialog
        open={editOpen}
        onOpenChange={(value) => {
          setEditOpen(value);
          if (!value) setSelectedArticle(null);
        }}
        article={selectedArticle}
        onSave={async (updatedArticle) => {
          try {
            const res = await fetch(`/api/articulos?id=${updatedArticle.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                Titulo: updatedArticle.title,
                IdCategoria: 1,
                Estatus: updatedArticle.status === "Publicado" ? 1 : 2,
              }),
            });
            if (!res.ok) throw new Error("Error al actualizar");
            setArticles((prev) =>
              prev.map((a) => (a.id === updatedArticle.id ? { ...a, ...updatedArticle } : a))
            );
          } catch (err) {
            console.error(err);
            alert("Error al guardar cambios");
          }
        }}
      />

      <DeleteArticleDialog
        open={deleteOpen}
        onOpenChange={(value) => {
          setDeleteOpen(value);
          if (!value) setSelectedArticle(null);
        }}
        article={selectedArticle}
        onConfirm={() => {
          // handle delete logic here
          console.log("Deleted article:", selectedArticle?.IdCategoria);
          setDeleteOpen(false);
        }}
      />

      <ViewArticleDialog
        open={viewOpen}
        onOpenChange={(value) => {
          setViewOpen(value);
          if (!value) setSelectedArticle(null);
        }}
        article={selectedArticle}
      />
    </main>
  );
}
