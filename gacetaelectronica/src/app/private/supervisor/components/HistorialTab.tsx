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
import { ArticuloHistorial } from "./data/dummyData";
import FilterControls from "./FilterControls";

interface HistorialTabProps {
  filterState: {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    filterBy: string;
    setFilterBy: (value: string) => void;
    filterValue: string;
    setFilterValue: (value: string) => void;
    filteredData: ArticuloHistorial[];
    getFilterOptions: () => string[];
    filteredCount: number;
    totalItems: number;
  };
  filterConfig: {
    filterFields: {
      [key: string]: {
        label: string;
        key: keyof ArticuloHistorial;
      };
    };
  };
}

export default function HistorialTab({
  filterState,
  filterConfig,
}: HistorialTabProps) {
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

  const getDecisionBadge = (decision: "Publicado" | "Rechazado") => {
    const variant = decision === "Publicado" ? "default" : "destructive";
    const bgColor =
      decision === "Publicado"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";

    return (
      <Badge variant={variant} className={`${bgColor} hover:${bgColor}`}>
        {decision}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="px-3 sm:px-6 py-3 sm:py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">
                Historial de Revisiones
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Registro histórico de todos los artículos que han sido
                revisados.
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
                searchPlaceholder="Buscar título, autor o retroalimentación..."
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
                      Fecha
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Decisión
                    </TableHead>
                    <TableHead className="hidden xl:table-cell max-w-[200px]">
                      Retroalimentación
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((articulo: ArticuloHistorial) => (
                      <TableRow key={articulo.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium text-sm sm:text-base">
                              {articulo.titulo}
                            </div>
                            {/* Info adicional visible solo en móvil/tablet */}
                            <div className="sm:hidden text-xs text-gray-500 mt-1 space-y-0.5">
                              <div>Autor: {articulo.autor}</div>
                              <div className="md:hidden">
                                Fecha:{" "}
                                {new Date(
                                  articulo.fechaRevision
                                ).toLocaleDateString("es-ES")}
                              </div>
                              <div className="lg:hidden flex items-center gap-2">
                                Decisión: {getDecisionBadge(articulo.decision)}
                              </div>
                              <div className="xl:hidden">
                                <span className="font-medium">
                                  Retroalimentación:
                                </span>
                                <div className="text-xs mt-0.5 line-clamp-2">
                                  {articulo.retroalimentacion}
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">
                          {articulo.autor}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">
                          {new Date(articulo.fechaRevision).toLocaleDateString(
                            "es-ES"
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {getDecisionBadge(articulo.decision)}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell max-w-xs">
                          <div
                            className="truncate text-sm"
                            title={articulo.retroalimentacion}
                          >
                            {articulo.retroalimentacion}
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
                            : "No hay artículos en el historial"}
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
    </div>
  );
}
