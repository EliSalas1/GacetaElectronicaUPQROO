import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArticuloHistorial } from "./data/dummyData"
import FilterControls from "./FilterControls"

interface HistorialTabProps {
  filterState: {
    searchTerm: string
    setSearchTerm: (value: string) => void
    filterBy: string
    setFilterBy: (value: string) => void
    filterValue: string
    setFilterValue: (value: string) => void
    filteredData: ArticuloHistorial[]
    getFilterOptions: () => string[]
    filteredCount: number
    totalItems: number
  }
  filterConfig: {
    filterFields: {
      [key: string]: {
        label: string
        key: keyof ArticuloHistorial
      }
    }
  }
}

export default function HistorialTab({ filterState, filterConfig }: HistorialTabProps) {
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

  const getDecisionBadge = (decision: 'Publicado' | 'Rechazado') => {
    const variant = decision === 'Publicado' ? 'default' : 'destructive'
    const bgColor = decision === 'Publicado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    
    return (
      <Badge variant={variant} className={`${bgColor} hover:${bgColor}`}>
        {decision}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Historial de Revisiones</CardTitle>
              <CardDescription>
                Registro histórico de todos los artículos que han sido revisados.
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
              searchPlaceholder="Buscar título, autor o retroalimentación..."
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Fecha de Revisión</TableHead>
                <TableHead>Decisión</TableHead>
                <TableHead>Retroalimentación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((articulo: ArticuloHistorial) => (
                  <TableRow key={articulo.id}>
                    <TableCell className="font-medium">{articulo.titulo}</TableCell>
                    <TableCell>{articulo.autor}</TableCell>
                    <TableCell>
                      {new Date(articulo.fechaRevision).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>
                      {getDecisionBadge(articulo.decision)}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={articulo.retroalimentacion}>
                        {articulo.retroalimentacion}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchTerm || filterValue !== "all" 
                      ? "No se encontraron artículos que coincidan con los filtros aplicados"
                      : "No hay artículos en el historial"
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
