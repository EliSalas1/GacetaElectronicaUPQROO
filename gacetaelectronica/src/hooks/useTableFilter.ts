import { useState, useMemo } from 'react'

export interface FilterConfig<T> {
  searchFields: (keyof T)[]
  filterFields: {
    [key: string]: {
      label: string
      key: keyof T
    }
  }
}

export function useTableFilter<T extends Record<string, any>>(
  data: T[],
  config: FilterConfig<T>
) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState(Object.keys(config.filterFields)[0] || "")
  const [filterValue, setFilterValue] = useState("all")

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Filtro de búsqueda
      const matchSearch = config.searchFields.some(field => {
        const value = item[field]
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      })

      // Filtro por campo específico
      let matchFilter = true
      if (filterValue !== "all" && filterBy) {
        const fieldConfig = config.filterFields[filterBy]
        if (fieldConfig) {
          const itemValue = item[fieldConfig.key]
          matchFilter = itemValue === filterValue
        }
      }

      return (searchTerm === "" || matchSearch) && matchFilter
    })
  }, [data, searchTerm, filterBy, filterValue, config])

  const getFilterOptions = () => {
    if (!filterBy) return []
    
    const fieldConfig = config.filterFields[filterBy]
    if (!fieldConfig) return []

    const options = new Set<string>()
    data.forEach((item) => {
      const value = item[fieldConfig.key]
      if (value) {
        options.add(value.toString())
      }
    })
    return Array.from(options)
  }

  const resetFilters = () => {
    setSearchTerm("")
    setFilterValue("all")
  }

  return {
    searchTerm,
    setSearchTerm,
    filterBy,
    setFilterBy: (value: string) => {
      setFilterBy(value)
      setFilterValue("all")
    },
    filterValue,
    setFilterValue,
    filteredData,
    getFilterOptions,
    resetFilters,
    totalItems: data.length,
    filteredCount: filteredData.length
  }
}
