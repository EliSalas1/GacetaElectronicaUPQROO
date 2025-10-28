"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

interface FilterSearchBarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  filterBy: string
  onFilterByChange: (value: string) => void
  filterValue: string
  onFilterValueChange: (value: string) => void
  availableFields: { label: string, value: string }[]
  getFilterValues: (field: string) => string[]
  searchPlaceholder?: string
}

export default function FilterSearchBar({
  searchValue,
  onSearchChange,
  filterBy,
  onFilterByChange,
  filterValue,
  onFilterValueChange,
  availableFields,
  getFilterValues,
  searchPlaceholder = "Buscar..."
}: FilterSearchBarProps) {
  const formatOptionLabel = (option: string, fieldKey: string) => {
    if (!option) return ""
    if (fieldKey?.toLowerCase().includes("fecha") || fieldKey?.toLowerCase().includes("date")) {
      return option
    }
    return option.charAt(0).toUpperCase() + option.slice(1).replace(/[_-]/g, " ")
  }

  const filterOptions = getFilterValues(filterBy) ?? []

  return (
    <div className="flex flex-wrap gap-2 w-full md:w-auto">
      {/* Search input */}
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className="pl-10"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter by field */}
      <Select
        value={filterBy}
        onValueChange={(val) => {
          onFilterByChange(val)
          onFilterValueChange("all")
        }}
      >
        <SelectTrigger className="w-40">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Filtrar por" />
        </SelectTrigger>
        <SelectContent>
          {availableFields.map((field) => (
            <SelectItem key={field.value} value={field.value}>
              {field.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Filter by value */}
      <Select value={filterValue} onValueChange={onFilterValueChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Filtrar valor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {filterOptions.map((val) => (
            <SelectItem key={val} value={val}>
              {formatOptionLabel(val, filterBy)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

