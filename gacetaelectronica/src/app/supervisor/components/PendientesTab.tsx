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
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Artículos Pendientes de Revisión</CardTitle>
              <CardDescription>
                Artículos que requieren revisión y aprobación del supervisor.
                {filteredCount !== totalItems && (
                  <span className="ml-2 text-sm">
                    Mostrando {filteredCount} de {totalItems} artículos
                  </span>
                )}
              </CardDescription>
            </div>
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
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Fecha de Envío</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((articulo: ArticuloPendiente) => (
                  <TableRow key={articulo.id}>
                    <TableCell className="font-medium">{articulo.titulo}</TableCell>
                    <TableCell>{articulo.autor}</TableCell>
                    <TableCell>{articulo.categoria}</TableCell>
                    <TableCell>
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
                    {searchTerm || filterValue !== "all" 
                      ? "No se encontraron artículos que coincidan con los filtros aplicados"
                      : "No hay artículos pendientes de revisión"
                    }
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
