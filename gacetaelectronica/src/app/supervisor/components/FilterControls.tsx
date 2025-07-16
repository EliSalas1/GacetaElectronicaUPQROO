import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

interface FilterControlsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterBy: string;
  setFilterBy: (value: string) => void;
  filterValue: string;
  setFilterValue: (value: string) => void;
  filterOptions: string[];
  filterFields: {
    [key: string]: {
      label: string;
      key: string;
    };
  };
  searchPlaceholder?: string;
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
  searchPlaceholder = "Buscar...",
}: FilterControlsProps) {
  const formatOptionLabel = (option: string, fieldKey: string) => {
    // Si es una fecha, mantenerla como está
    if (fieldKey.includes("fecha") || fieldKey.includes("date")) {
      return option;
    }
    // Para otros campos, capitalizar
    return (
      option.charAt(0).toUpperCase() + option.slice(1).replace(/[_-]/g, " ")
    );
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      {/* Búsqueda */}
      <div className="relative w-full sm:w-64">
        <Input
          className="text-sm"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          showSearchIcon={true}
        />
      </div>

      {/* Contenedor de filtros - se apila en móvil */}
      <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
        {/* Filtro por campo */}
        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger className="w-full xs:w-32 sm:w-40">
            <Filter className="mr-2 h-4 w-4 flex-shrink-0" />
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
          <SelectTrigger className="w-full xs:w-32 sm:w-40">
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
    </div>
  );
}
