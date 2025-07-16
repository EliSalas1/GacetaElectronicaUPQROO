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
import { ArticuloPendiente } from "./data/dummyData";
import FilterControls from "./FilterControls";
import FeedbackModal from "./FeedbackModal";
import { useState } from "react";
import { toast } from "sonner";

interface PendientesTabProps {
  onViewArticle?: (articleId: number) => void;
  filterState: {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    filterBy: string;
    setFilterBy: (value: string) => void;
    filterValue: string;
    setFilterValue: (value: string) => void;
    filteredData: ArticuloPendiente[];
    getFilterOptions: () => string[];
    filteredCount: number;
    totalItems: number;
  };
  filterConfig: {
    filterFields: {
      [key: string]: {
        label: string;
        key: keyof ArticuloPendiente;
      };
    };
  };
}

export default function PendientesTab({
  onViewArticle,
  filterState,
  filterConfig,
}: PendientesTabProps) {
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    articleId: number | null;
    articleTitle: string;
    authorName: string;
  }>({
    isOpen: false,
    articleId: null,
    articleTitle: "",
    authorName: "",
  });

  const {
    searchTerm,
    setSearchTerm,
    filterBy,
    setFilterBy,
    filterValue,
    setFilterValue,
    filteredData,
    getFilterOptions,
    filteredCount,
    totalItems,
  } = filterState;

  const handleViewArticle = (articleId: number) => {
    // Aquí se implementará la navegación al artículo
    console.log(`Viewing article with ID: ${articleId}`);
    onViewArticle?.(articleId);
  };

  const handleApproveArticle = async (
    articleId: number,
    articleTitle: string
  ) => {
    try {
      // TODO: Implementar aprobación del artículo
      // - Crear endpoint API para aprobar el artículo
      // - Actualizar el estado del artículo a "aprobado" (estatus 3)
      // - Enviar notificación por email al autor
      // - Registrar la acción en el historial de cambios
      // - Remover el artículo de la lista de pendientes

      console.log(`Aprobando artículo ${articleId}: ${articleTitle}`);
      toast.success(`Artículo "${articleTitle}" aprobado exitosamente`);

      // Simular la actualización de la lista
      // En producción, esto debería actualizar el estado global o refrescar los datos
    } catch (error) {
      console.error("Error al aprobar artículo:", error);
      toast.error("Error al aprobar el artículo. Inténtalo de nuevo.");
    }
  };

  const handleRejectArticle = (
    articleId: number,
    articleTitle: string,
    authorName: string
  ) => {
    setFeedbackModal({
      isOpen: true,
      articleId,
      articleTitle,
      authorName,
    });
  };

  const closeFeedbackModal = () => {
    setFeedbackModal({
      isOpen: false,
      articleId: null,
      articleTitle: "",
      authorName: "",
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="px-3 sm:px-6 py-3 sm:py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">
                Artículos Pendientes de Revisión
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Artículos que requieren revisión y aprobación del supervisor.
                {filteredCount !== totalItems && (
                  <span className="block sm:inline sm:ml-2 text-xs sm:text-sm font-medium">
                    Mostrando {filteredCount} de {totalItems} artículos
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="w-full lg:w-auto">
              <FilterControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterBy={filterBy}
                setFilterBy={setFilterBy}
                filterValue={filterValue}
                setFilterValue={setFilterValue}
                filterOptions={getFilterOptions()}
                filterFields={filterConfig.filterFields}
                searchPlaceholder="Buscar título o autor..."
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          {/* Tabla responsiva */}
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px] sm:min-w-0">
                      Título
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Autor
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Categoría
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Fecha de Envío
                    </TableHead>
                    <TableHead className="text-center w-24 sm:w-32">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((articulo: ArticuloPendiente) => (
                      <TableRow key={articulo.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium text-sm sm:text-base">
                              {articulo.titulo}
                            </div>
                            {/* Info adicional visible solo en móvil */}
                            <div className="sm:hidden text-xs text-gray-500 mt-1 space-y-0.5">
                              <div>Autor: {articulo.autor}</div>
                              <div className="md:hidden">
                                Categoría: {articulo.categoria}
                              </div>
                              <div className="lg:hidden">
                                Fecha:{" "}
                                {new Date(
                                  articulo.fechaEnvio
                                ).toLocaleDateString("es-ES")}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">
                          {articulo.autor}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">
                          {articulo.categoria}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">
                          {new Date(articulo.fechaEnvio).toLocaleDateString(
                            "es-ES"
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            {/* Botón Ver */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewArticle(articulo.id)}
                              className="h-8 w-8 p-0"
                              title="Ver artículo"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Ver artículo</span>
                            </Button>

                            {/* Botón Aprobar */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleApproveArticle(
                                  articulo.id,
                                  articulo.titulo
                                )
                              }
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                              title="Aprobar artículo"
                            >
                              <Check className="h-4 w-4" />
                              <span className="sr-only">Aprobar artículo</span>
                            </Button>

                            {/* Botón Rechazar */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRejectArticle(
                                  articulo.id,
                                  articulo.titulo,
                                  articulo.autor
                                )
                              }
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Rechazar artículo"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Rechazar artículo</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        <div className="text-sm sm:text-base">
                          {searchTerm || filterValue !== "all"
                            ? "No se encontraron artículos que coincidan con los filtros aplicados"
                            : "No hay artículos pendientes de revisión"}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Feedback */}
      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={closeFeedbackModal}
        articleTitle={feedbackModal.articleTitle}
        authorName={feedbackModal.authorName}
        articleId={feedbackModal.articleId || 0}
      />
    </div>
  );
}
