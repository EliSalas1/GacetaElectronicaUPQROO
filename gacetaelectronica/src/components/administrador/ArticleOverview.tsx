"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditArticleDialog } from "./EditArticleDialog";
import { DeleteArticleDialog } from "./DeleteArticleDialog";
import { ViewArticleDialog } from "./ViewArticleDialog";
import EventOverview from "./EventsOverview";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Article {
  id: number;
  title: string;
  createdAt: string;
  status: string;
  category: string;
  author: string;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "published":
      return <Badge className="bg-green-100 text-green-800">Publicado</Badge>;
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800">En Revisión</Badge>
      );
    case "rejected":
      return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>;
    case "draft":
      return <Badge variant="secondary">Borrador</Badge>;
    default:
      return <Badge variant="outline">Desconocido</Badge>;
  }
};

export default function ArticleOverview() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  // Estados del filtro
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        let url = "/api/articulos";
        const params = new URLSearchParams();
        if (filterBy && filterValue && filterValue !== "all") {
          if (filterBy === "category") params.append("categoria", filterValue);
          if (filterBy === "status") params.append("status", filterValue);
        }
        params.append("limit", "50");
        params.append("offset", "0");
        url += `?${params.toString()}`;

        const res = await fetch(url);
        const data = await res.json();
        setArticles(data); // Aquí se asignan los datos
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [filterBy, filterValue]);

  // Para filtrar local por búsqueda de texto
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
                setFilterValue(""); // reset valor
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
                  ? ["1", "2"]
                  : filterBy === "status"
                  ? ["1", "2"]
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
          {loading ? (
            <p className="text-center">Cargando artículos...</p>
          ) : (
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
                {filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">
                      {article.title}
                    </TableCell>
                    <TableCell>{article.author}</TableCell>
                    <TableCell>{article.category}</TableCell>
                    <TableCell>{getStatusBadge(article.status)}</TableCell>
                    <TableCell>
                      {format(new Date(article.createdAt), "dd/MM/yyyy", {
                        locale: es,
                      })}
                    </TableCell>
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
                ))}
              </TableBody>
            </Table>
          )}
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
              prev.map((a) =>
                a.id === updatedArticle.id ? { ...a, ...updatedArticle } : a
              )
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
        onConfirm={async () => {
          try {
            const res = await fetch(
              `/api/articulos?id=${selectedArticle?.id}`,
              {
                method: "DELETE",
              }
            );
            if (!res.ok) throw new Error("Error al eliminar");
            setArticles((prev) =>
              prev.filter((a) => a.id !== selectedArticle?.id)
            );
          } catch (err) {
            console.error(err);
            alert("Error al eliminar artículo");
          } finally {
            setDeleteOpen(false);
          }
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

      <EventOverview />
    </main>
  );
}
