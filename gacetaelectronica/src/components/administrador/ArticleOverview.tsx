'use client';

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
import { toast } from "sonner";

// Función para obtener el estado con badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case "published":
      return <Badge className="bg-green-100 text-green-800">Publicado</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800">En Revisión</Badge>;
    case "rejected": // Estado para "Rechazado"
      return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>;
    case "unknown": // Estado Desconocido también como Rechazado en rojo
      return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>;
    default:
      return <Badge variant="outline">Desconocido</Badge>;
  }
};

export default function ArticleOverview() {
  const [selectedArticle, setSelectedArticle] = useState<ArticleInterface | null>(null);
  
  const [resources, setResources] = useState<any[]>([]);
  const [loadingResources, setLoadingResources] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [articles, setArticles] = useState<ArticleInterface[]>([]);
  const [authorsLoaded, setAuthorsLoaded] = useState(false);

  const { data, loading } = useFetch<ArticleInterface[]>("/api/articulos?limit=50&offset=0");

  useEffect(() => {
    if (data) {
      setArticles(data); // Cargar los artículos
    }
  }, [data]);

  // Obtener el autor de un artículo en base a su ID
  const fetchAuthor = async (articuloId: number) => {
    try {
      const res = await fetch(`/api/articuloUsuario?articuloId=${articuloId}`);
      const authorData = await res.json();
      return authorData[0] ? `${authorData[0].Nombre} ${authorData[0].Apellido}` : "Sin autor";
    } catch (err) {
      console.error(err);
      return "Anonimo";
    }
  };

  // Evitar los GETs infinitos y controlar las solicitudes a los autores
  useEffect(() => {
    if (articles.length > 0 && !authorsLoaded) {
      const fetchArticlesWithAuthors = async () => {
        const articlesWithAuthors = await Promise.all(
          articles.map(async (article) => {
            const author = await fetchAuthor(article.id);
            return { ...article, author };
          })
        );

        setArticles(articlesWithAuthors); // Actualiza los artículos con los datos de autor
        setAuthorsLoaded(true); // Marcar que ya hemos cargado los autores
      };

      fetchArticlesWithAuthors();
    }
  }, [articles, authorsLoaded]); // Solo ejecuta cuando se actualicen los artículos y los autores no se hayan cargado aún

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

  const handleSave = async (updatedArticle: ArticleInterface) => {
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
          Estatus: updatedArticle.status === "published" ? 1 : updatedArticle.status === "pending" ? 0 : 2,
          IdCategoria: 1,
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar artículo");

      // Actualizar el artículo en el estado local sin necesidad de recargar la página
      const updatedArticles = articles.map((article) =>
        article.id === updatedArticle.id ? { ...article, ...updatedArticle } : article
      );

      setArticles(updatedArticles); // Actualiza el estado local de los artículos
      setSelectedArticle(updatedArticle);
      alert("Artículo actualizado");
    } catch (err) {
      console.error(err);
      alert("Error al guardar cambios");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/articulos?id=${selectedArticle?.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar");

      // Eliminar el artículo del estado local sin necesidad de recargar la página
      const updatedArticles = articles.filter((article) => article.id !== selectedArticle?.id);
      setArticles(updatedArticles);

      toast("Artículo eliminado");
      setDeleteOpen(false);
    } catch (err) {
      console.error(err);
      toast("Error al eliminar artículo");
    }
  };

const handleViewArticle = async (article: ArticleInterface) => {
  setLoadingResources(true);
  setViewOpen(true);

  try {
    const res = await fetch(`http://localhost:4000/api/articulos?id=${article.id}`);
    const data = await res.json();

    // Procesar los recursos (vienen como string separados por coma)
    const recursoArray = data.Recursos
      ? data.Recursos.split(",").map((url: string, index: number) => ({
          idRecurso: index + 1,
          nombre: `Recurso ${index + 1}`,
          url: url.trim(),
          tipo: "link",
          idArticulo: article.id,
        }))
      : [];

    setResources(recursoArray);

    setSelectedArticle({
      id: article.id,
      title: data.Titulo,
      resumen: data.Resumen,
      contenido: data.Contenido,
      createdAt: data.createdAt,
      category: data.Categoria?.trim() || article.category,
      author: data.Autor || article.author,
      status: data.status || article.status,
    });
  } catch (err) {
    console.error("Error al obtener datos completos del artículo:", err);
    setSelectedArticle(article); // fallback
    setResources([]);
  } finally {
    setLoadingResources(false);
  }
};




  return (
    <main className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex justify-between items-start flex-col md:flex-row gap-4">
         
          <div className="flex flex-col gap-1">
  <CardTitle>Gestión de Artículos</CardTitle>
  <CardDescription>Administra los textos de los autores</CardDescription>
            </div>

            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <Input
                className="md:w-64"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={filterBy} onValueChange={(value) => { setFilterBy(value); setFilterValue(""); }}>
                <SelectTrigger className="w-full md:w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category">Categoría</SelectItem>
                  <SelectItem value="status">Estado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterValue} onValueChange={setFilterValue}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Filtrar valor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {filterBy === "status" &&
                    ["publicado", "en revisión", "rechazado"].map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  {filterBy === "category" && Array.isArray(articles) &&
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
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="max-w-xs truncate">Título</TableHead>
                <TableHead className="max-w-xs truncate">Resumen</TableHead>
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
              ) : filteredData.length > 0 ? (
                filteredData.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium max-w-xs truncate">{article.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{article.resumen}</TableCell>
                    <TableCell>{article.category}</TableCell>
                    <TableCell>{article.author}</TableCell>
                    <TableCell>{getStatusBadge(article.status)}</TableCell>
                    <TableCell>{new Date(article.createdAt).toLocaleDateString("es-MX")}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {/* <Button variant="ghost" size="sm" onClick={() => { setSelectedArticle(article); setViewOpen(true); }} > */}
                        <Button variant="ghost" size="sm" onClick={() => handleViewArticle(article)}>

                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedArticle(article); setEditOpen(true); }} >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedArticle(article); setDeleteOpen(true); }} >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No hay artículos disponibles.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      <EditArticleDialog
        open={editOpen}
        onOpenChange={(value) => {
          setEditOpen(value);
          if (!value) setSelectedArticle(null);
        }}
        article={selectedArticle}
        onSave={(updatedArticle: Partial<ArticleInterface>) => {
          if (updatedArticle.id) {
            handleSave(updatedArticle as ArticleInterface);
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
        onConfirm={handleDelete}
      />

      <ViewArticleDialog
        open={viewOpen}
  onOpenChange={(value) => {
    setViewOpen(value);
    if (!value) {
      setSelectedArticle(null);
      setResources([]);
    }
  }}
  article={selectedArticle}
  resources={resources}
  loadingResources={loadingResources}
      />
    </main>
  );
}
