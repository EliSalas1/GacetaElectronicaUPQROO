"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Edit, Trash2, Filter } from "lucide-react";
import { ArticleInterface } from "@/entities/article";
import { EditArticleDialog } from "./EditArticleDialog";
import { DeleteArticleDialog } from "./DeleteArticleDialog";
import { ViewArticleDialog } from "./ViewArticleDialog";
import { useFetch } from "@/hooks/useFetch";
import { Spinner } from "../Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "published":
      return <Badge className="bg-green-100 text-green-800">Publicado</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800">En Revisión</Badge>;
    default:
      return <Badge variant="outline">Desconocido</Badge>;
  }
};

export default function ArticleOverview() {
  const [selectedArticle, setSelectedArticle] = useState<ArticleInterface | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [filterValue, setFilterValue] = useState("");
  
  // Recupera los artículos desde la API
  const { data: articles, loading } = useFetch<ArticleInterface[]>("/api/articulos?limit=50&offset=0");

  // Verificación de los datos recibidos
  useEffect(() => {
    console.log("Artículos cargados:", articles);
  }, [articles]);

  const filteredData = Array.isArray(articles)
    ? articles.filter((article) => {
        const matchesSearch = article.title?.toLowerCase().includes(searchTerm.toLowerCase());
        let matchesFilter = true;
        if (filterBy && filterValue && filterValue !== "all") {
          if (filterBy === "category") matchesFilter = article.category === filterValue;
          if (filterBy === "status") matchesFilter = article.status === filterValue;
        }
        return matchesSearch && matchesFilter;
      })
    : [];

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

          <div className="flex gap-2 w-full md:w-auto">
            <Input
              className="w-full md:w-64 pl-10"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={filterBy}
              onValueChange={(value) => {
                setFilterBy(value);
                setFilterValue("");
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
            <Select value={filterValue} onValueChange={setFilterValue}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filtrar valor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {filterBy === "status" &&
                  ["published", "pending", "unknown"].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                {filterBy === "category" &&
                  Array.from(new Set(articles.map((article) => article.category))).map((option) => (
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
                <TableHead>Autor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Creación</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
  {loading ? (
    <TableRow>
      <TableCell colSpan={7} className="text-center">
        <Spinner />
      </TableCell>
    </TableRow>
  ) : (
    filteredData.map((article) => (
      <TableRow key={article.id}> {/* Asegúrate de que `article.id` sea único */}
        <TableCell className="font-medium">{article.title}</TableCell>
        <TableCell>{article.resumen}</TableCell>
        <TableCell>{article.category}</TableCell>
        <TableCell>{article.author}</TableCell>
        <TableCell>{getStatusBadge(article.status)}</TableCell>
        <TableCell>{new Date(article.createdAt).toLocaleDateString("es-MX")}</TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setSelectedArticle(article); setViewOpen(true); }}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setSelectedArticle(article); setEditOpen(true); }}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setSelectedArticle(article); setDeleteOpen(true); }}>
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

      {/* Edit Article Dialog */}
      <EditArticleDialog
        open={editOpen}
        onOpenChange={(value) => {
          setEditOpen(value);
          if (!value) setSelectedArticle(null);
        }}
        article={selectedArticle}
        onSave={async (updatedArticle) => {
          if (!updatedArticle?.id || !updatedArticle?.title || !updatedArticle?.status) {
            alert("Faltan campos requeridos");
            return;
          }
          try {
            const res = await fetch(`/api/articulos?id=${updatedArticle.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                Titulo: updatedArticle.title,
                Resumen: updatedArticle.resumen,
                Estatus: updatedArticle.status === "published" ? 1 : 2,
                IdCategoria: 1
              }),
            });
            if (!res.ok) throw new Error("Error al actualizar artículo");
            // aquí puedes refrescar la lista si tienes una función como `refetch()`
            alert("Artículo actualizado");
          } catch (err) {
            console.error(err);
            alert("Error al guardar cambios");
          }
        }}
      />

      {/* Delete Article Dialog */}
      <DeleteArticleDialog
        open={deleteOpen}
        onOpenChange={(value) => {
          setDeleteOpen(value);
          if (!value) setSelectedArticle(null);
        }}
        article={selectedArticle}
        onConfirm={async () => {
          try {
            const res = await fetch(`/api/articulos?id=${selectedArticle?.id}`, {
              method: "DELETE",
            });
            if (!res.ok) throw new Error("Error al eliminar");
            alert("Artículo eliminado");
            // Aquí podrías hacer refetch o actualizar el estado manualmente
          } catch (err) {
            console.error(err);
            alert("Error al eliminar artículo");
          } finally {
            setDeleteOpen(false);
          }
        }}
      />

      {/* View Article Dialog */}
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
