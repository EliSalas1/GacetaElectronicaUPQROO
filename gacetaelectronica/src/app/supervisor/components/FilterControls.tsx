import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

interface FilterControlsProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  filterBy: string
  setFilterBy: (value: string) => void
  filterValue: string
  setFilterValue: (value: string) => void
  filterOptions: string[]
  filterFields: {
    [key: string]: {
      label: string
      key: string
    }
  }
  searchPlaceholder?: string
}

export default function FilterControls({
  searchTerm,
  setSearchTerm,
  filterBy,
  setFilterBy,
  filterValue,
  setFilterValue,
  filterOptions,
  filterFields,
  searchPlaceholder = "Buscar..."
}: FilterControlsProps) {
  const formatOptionLabel = (option: string, fieldKey: string) => {
    // Si es una fecha, mantenerla como está
    if (fieldKey.includes('fecha') || fieldKey.includes('date')) {
      return option
    }
    // Para otros campos, capitalizar
    return option.charAt(0).toUpperCase() + option.slice(1).replace(/[_-]/g, ' ')
  }

  return (
    <div className="flex gap-2 w-full md:w-auto">
      {/* Búsqueda */}
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className="pl-10"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filtro por campo */}
      <Select value={filterBy} onValueChange={setFilterBy}>
        <SelectTrigger className="w-40">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Filtrar por" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(filterFields).map(([key, config]) => (
            <SelectItem key={key} value={key}>
              {config.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Filtro por valor */}
      <Select value={filterValue} onValueChange={setFilterValue}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Filtrar valor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {filterOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {formatOptionLabel(option, filterBy)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
