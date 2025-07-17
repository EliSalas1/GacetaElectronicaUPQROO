"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Check, X } from "lucide-react";
import FeedbackModal from "./FeedbackModal";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Articulo {
  idArticulo: number;
  Titulo: string;
  categoria: string;
  FechaCreacion: string;
}

interface Usuario {
  idUsuarios: number;
  Nombre: string;
}

const ITEMS_PER_PAGE = 10;

export default function PendientesTab({
  onViewArticle,
}: {
  onViewArticle?: (articleId: number) => void;
}) {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [autoresMap, setAutoresMap] = useState<Record<number, string>>({});
  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    articleId: null,
    articleTitle: "",
    authorName: "",
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Fetch artículos y autores
  useEffect(() => {
    async function fetchData() {
      try {
        const resArticulos = await fetch("/api/filtros/articulosPendientes?tipo=pendientes");
        if (!resArticulos.ok) throw new Error("Error al obtener artículos");
        const articulosData: Articulo[] = await resArticulos.json();
        setArticulos(articulosData);

        const autoresEntries = await Promise.all(
          articulosData.map(async (art) => {
            try {
              const resUsuarios = await fetch(`/api/articuloUsuario/?articuloId=${art.idArticulo}`);
              if (!resUsuarios.ok) throw new Error("No se pudo obtener autor");
              const usuarios: Usuario[] = await resUsuarios.json();
              return [art.idArticulo, usuarios[0]?.Nombre || "Desconocido"] as [number, string];
            } catch {
              return [art.idArticulo, "Desconocido"] as [number, string];
            }
          })
        );
        setAutoresMap(Object.fromEntries(autoresEntries));
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar artículos o autores.");
      }
    }
    fetchData();
  }, []);

  // Calcular artículos visibles en la página actual
  const totalPages = Math.ceil(articulos.length / ITEMS_PER_PAGE);
  const currentItems = articulos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleApproveArticle = async (articleId: number, articleTitle: string) => {
    try {
      const res = await fetch(`/api/articulos?id=${articleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Estatus: 1 }),
      });
      if (!res.ok) throw new Error("No se pudo aprobar el artículo");
      toast.success(`Artículo "${articleTitle}" aprobado correctamente`);
      setArticulos((prev) => prev.filter((art) => art.idArticulo !== articleId));
    } catch (error) {
      console.error(error);
      toast.error("Error al aprobar el artículo.");
    }
  };

  const handleRejectArticle = async (articleId: number, articleTitle: string) => {
    try {
      const res = await fetch(`/api/articulos?id=${articleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Estatus: 2 }),
      });
      if (!res.ok) throw new Error("No se pudo rechazar el artículo");
      toast.success(`Artículo "${articleTitle}" rechazado correctamente`);
      setArticulos((prev) => prev.filter((art) => art.idArticulo !== articleId));
    } catch (error) {
      console.error(error);
      toast.error("Error al rechazar el artículo.");
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="px-3 sm:px-6 py-3 sm:py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">
                Artículos Pendientes de Revisión
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Artículos que requieren revisión y aprobación del supervisor.
                {articulos.length > 0 && (
                  <span className="block sm:inline sm:ml-2 text-xs sm:text-sm font-medium">
                    Mostrando {articulos.length} artículos en total
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px] sm:min-w-0">Título</TableHead>
                    <TableHead className="hidden sm:table-cell">Autor</TableHead>
                    <TableHead className="hidden md:table-cell">Categoría</TableHead>
                    <TableHead className="hidden lg:table-cell">Fecha de Envío</TableHead>
                    <TableHead className="text-center w-24 sm:w-32">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((articulo) => (
                      <TableRow key={articulo.idArticulo}>
                        <TableCell className="font-medium text-sm sm:text-base">
                          {articulo.Titulo}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">
                          {autoresMap[articulo.idArticulo] ?? "Cargando..."}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">
                          {articulo.categoria || "Sin categoría"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">
                          {new Date(articulo.FechaCreacion).toLocaleDateString("es-ES")}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewArticle?.(articulo.idArticulo)}
                              className="h-8 w-8 p-0"
                              title="Ver artículo"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApproveArticle(articulo.idArticulo, articulo.Titulo)}
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                              title="Aprobar artículo"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRejectArticle(articulo.idArticulo, articulo.Titulo)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Rechazar artículo"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No hay artículos pendientes de revisión
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Controles de paginación */}
          {totalPages > 1 && (
            <div className="flex justify-end mt-4 gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Anterior
              </Button>
              <span className="text-sm flex items-center">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Siguiente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={() =>
          setFeedbackModal({ isOpen: false, articleId: null, articleTitle: "", authorName: "" })
        }
        articleTitle={feedbackModal.articleTitle}
        authorName={feedbackModal.authorName}
        articleId={feedbackModal.articleId || 0}
      />
    </>
  );
}
