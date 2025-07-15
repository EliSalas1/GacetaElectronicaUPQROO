import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye } from "lucide-react"
import { ArticuloPendiente } from "./data/dummyData"
import FilterControls from "./FilterControls"

interface PendientesTabProps {
  onViewArticle?: (articleId: number) => void
  filterState: {
    searchTerm: string
    setSearchTerm: (value: string) => void
    filterBy: string
    setFilterBy: (value: string) => void
    filterValue: string
    setFilterValue: (value: string) => void
    filteredData: ArticuloPendiente[]
    getFilterOptions: () => string[]
    filteredCount: number
    totalItems: number
  }
  filterConfig: {
    filterFields: {
      [key: string]: {
        label: string
        key: keyof ArticuloPendiente
      }
    }
  }
}

export default function PendientesTab({ onViewArticle, filterState, filterConfig }: PendientesTabProps) {
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
    totalItems
  } = filterState

  const handleViewArticle = (articleId: number) => {
    // Aquí se implementará la navegación al artículo
    console.log(`Viewing article with ID: ${articleId}`)
    onViewArticle?.(articleId)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="px-3 sm:px-6 py-3 sm:py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Artículos Pendientes de Revisión</CardTitle>
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
                    <TableHead className="min-w-[200px] sm:min-w-0">Título</TableHead>
                    <TableHead className="hidden sm:table-cell">Autor</TableHead>
                    <TableHead className="hidden md:table-cell">Categoría</TableHead>
                    <TableHead className="hidden lg:table-cell">Fecha de Envío</TableHead>
                    <TableHead className="text-center w-16">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((articulo: ArticuloPendiente) => (
                      <TableRow key={articulo.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium text-sm sm:text-base">{articulo.titulo}</div>
                            {/* Info adicional visible solo en móvil */}
                            <div className="sm:hidden text-xs text-gray-500 mt-1 space-y-0.5">
                              <div>Autor: {articulo.autor}</div>
                              <div className="md:hidden">Categoría: {articulo.categoria}</div>
                              <div className="lg:hidden">
                                Fecha: {new Date(articulo.fechaEnvio).toLocaleDateString('es-ES')}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">{articulo.autor}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{articulo.categoria}</TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">
                          {new Date(articulo.fechaEnvio).toLocaleDateString('es-ES')}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewArticle(articulo.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver artículo</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        <div className="text-sm sm:text-base">
                          {searchTerm || filterValue !== "all" 
                            ? "No se encontraron artículos que coincidan con los filtros aplicados"
                            : "No hay artículos pendientes de revisión"
                          }
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
  )
}
