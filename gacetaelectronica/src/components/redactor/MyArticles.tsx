"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Eye, Edit, Trash2, Loader2 } from "lucide-react"
import FilterSearchBar from "@/components/FilterSearchBar"
import { useSessionUser } from "@/hooks/useSessionUser"

interface Articulo {
  IdArticulo: number;
  Titulo: string;
  Resumen: string;
  Contenido: string;
  Estatus: number;
  FechaCreacion: string;
  FechaRevision?: string;
  Comentario?: string;
  IdCategoria: number;
  IdAutor: number;
  IdRevisor?: number;
  Categoria?: {
    IdCategoria: number;
    Nombre: string;
  };
}

interface MyArticlesProps {
  onEditArticle?: (article: Articulo) => void;
}

const getStatusBadge = (status: number) => {
  switch (status) {
    case 1:
      return <Badge className="bg-yellow-100 text-yellow-800">En Revisión</Badge>
    case 2:
      return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>
    case 3:
      return <Badge className="bg-green-100 text-green-800">Publicado</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-800">Desconocido</Badge>
  }
}

const getStatusText = (status: number) => {
  switch (status) {
    case 1:
      return "En Revisión"
    case 2:
      return "Rechazado"
    case 3:
      return "Publicado"
    default:
      return "Desconocido"
  }
}

export default function MyArticles({ onEditArticle }: MyArticlesProps) {
  const { userInfo, loading: userLoading } = useSessionUser()
  const [articles, setArticles] = useState<Articulo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("category")
  const [filterValue, setFilterValue] = useState("all")
  const [selectedArticle, setSelectedArticle] = useState<Articulo | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Función para obtener el ID del usuario por email
  // const getUserIdByEmail = async (email: string) => {
  //   try {
  //     const response = await fetch(`/api/usuarios?email=${encodeURIComponent(email)}`)
  //     if (!response.ok) {
  //       throw new Error('Error al obtener información del usuario')
  //     }
  //     const userData = await response.json()
  //     return userData.IdUsuarios
  //   } catch (error) {
  //     console.error('Error al obtener ID del usuario:', error)
  //     return null
  //   }
  // }

  // Función para cargar artículos del usuario
  const loadUserArticles = async () => {
    if (!userInfo?.id) {
      setError('No se pudo identificar al usuario')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Usar el ID del usuario desde la sesión
      const userId = userInfo.id;
      if (!userId) {
        setError('No se pudo obtener el ID del usuario')
        setLoading(false)
        return
      }

      // Obtener artículos del usuario usando la API articuloUsuario
      const response = await fetch(`/api/articuloUsuario?usuarioId=${userId}`)
      if (!response.ok) {
        throw new Error('Error al cargar los artículos')
      }

      const userArticles = await response.json()
      
      // Para cada artículo, obtener información completa y categoría
      const articlesWithDetails = await Promise.all(
        userArticles.map(async (article: any) => {
          try {
            console.log('Artículo original:', article)
            
            // Verificar que el artículo tenga un ID válido
            const articleId = article.IdArticulo || article.idArticulo
            if (!articleId) {
              console.warn('Artículo sin ID válido:', article)
              return null
            }
            
            // Obtener información completa del artículo
            const articleResponse = await fetch(`/api/articulos?id=${articleId}&include=categoria`)
            if (articleResponse.ok) {
              const articleData = await articleResponse.json()
              console.log('Artículo con detalles:', articleData)
              // Asegurar que el campo IdArticulo existe
              if (articleData && !articleData.IdArticulo && articleData.idArticulo) {
                articleData.IdArticulo = articleData.idArticulo
              }
              return articleData
            }
            return article
          } catch (error) {
            console.error('Error al obtener detalles del artículo:', error)
            return article
          }
        })
      )

      // Filtrar artículos nulos
      const validArticles = articlesWithDetails.filter(article => article !== null)
      setArticles(validArticles)
    } catch (error) {
      console.error('Error al cargar artículos:', error)
      setError('Error al cargar los artículos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!userLoading && userInfo?.id) {
      loadUserArticles()
    }
  }, [userInfo?.id, userLoading])

  const handleAction = (action: string, title: string, article?: Articulo) => {
    if (action === "Editar" && article && onEditArticle) {
      console.log('Editando artículo:', article)
      onEditArticle(article)
    } else {
      toast(`${action} artículo`, {
        description: `Acción "${action}" realizada en "${title}"`,
      })
    }
  }

  const [selectedArticleResources, setSelectedArticleResources] = useState<any[]>([])
  const [loadingResources, setLoadingResources] = useState(false)

  const handleViewArticle = async (article: Articulo) => {
    console.log('Artículo seleccionado para ver:', article)
    console.log('Comentario del artículo:', article.Comentario)
    setSelectedArticle(article)
    setIsDialogOpen(true)
    setLoadingResources(true)
    
    try {
      // Cargar recursos del artículo
      const response = await fetch(`/api/recursos?articuloId=${article.IdArticulo}`)
      if (response.ok) {
        const resources = await response.json()
        setSelectedArticleResources(resources)
      } else {
        console.error('Error al cargar recursos del artículo')
        setSelectedArticleResources([])
      }
    } catch (error) {
      console.error('Error al cargar recursos:', error)
      setSelectedArticleResources([])
    } finally {
      setLoadingResources(false)
    }
  }

  const handleDeleteArticle = async (articleId: number) => {
    try {
      console.log('Intentando eliminar artículo ID:', articleId)
      
      const response = await fetch(`/api/articulos?id=${articleId}`, {
        method: 'DELETE',
      })

      console.log('Respuesta del servidor:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error del servidor:', errorText)
        throw new Error(`Error al eliminar el artículo: ${errorText}`)
      }

      const result = await response.json()
      console.log('Resultado de eliminación:', result)

      toast('Artículo eliminado', {
        description: 'El artículo ha sido eliminado correctamente',
      })

      // Recargar la lista de artículos
      loadUserArticles()
    } catch (error) {
      console.error('Error al eliminar artículo:', error)
      toast('Error al eliminar', {
        description: 'No se pudo eliminar el artículo',
      })
    }
  }

  const filteredArticles = articles.filter((article) => {
    // Verificar que el artículo tenga las propiedades necesarias
    if (!article || !article.Titulo) {
      return false
    }
    
    const matchSearch = article.Titulo.toLowerCase().includes(searchTerm.toLowerCase())
    let matchFilter = true

    if (filterValue !== "all") {
      switch (filterBy) {
        case "category":
          matchFilter = article.Categoria?.Nombre === filterValue
          break
        case "status":
          matchFilter = getStatusText(article.Estatus) === filterValue
          break
        case "createdAt":
          matchFilter = article.FechaCreacion === filterValue
          break
      }
    }

    return matchSearch && matchFilter
  })

  const getFilterOptions = (field: string) => {
    const values = new Set<string>()
    articles.forEach((article) => {
      switch (field) {
        case "category":
          if (article.Categoria?.Nombre) {
            values.add(article.Categoria.Nombre)
          }
          break
        case "status":
          values.add(getStatusText(article.Estatus))
          break
        case "createdAt":
          values.add(article.FechaCreacion)
          break
      }
    })
    return Array.from(values)
  }

  if (loading || userLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mis Artículos</CardTitle>
          <CardDescription>Cargando tus artículos...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mis Artículos</CardTitle>
          <CardDescription>Error al cargar los artículos</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadUserArticles}>Reintentar</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Mis Artículos</CardTitle>
            <CardDescription>Gestiona todos tus artículos creados</CardDescription>
          </div>
          <FilterSearchBar
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            filterBy={filterBy}
            onFilterByChange={setFilterBy}
            filterValue={filterValue}
            onFilterValueChange={setFilterValue}
            availableFields={[
              { label: "Categoría", value: "category" },
              { label: "Estado", value: "status" },
              { label: "Fecha", value: "createdAt" }
            ]}
            getFilterValues={getFilterOptions}
          />
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article,index) => {
                console.log(`Artículo ${index}:`, {
                  id: article.IdArticulo,
                  titulo: article.Titulo,
                  estatus: article.Estatus,
                  estatusText: getStatusText(article.Estatus)
                })
                return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{article.Titulo}</TableCell>
                  <TableCell className="capitalize">{article.Categoria?.Nombre || 'Sin categoría'}</TableCell>
                  <TableCell>{getStatusBadge(article.Estatus)}</TableCell>
                  <TableCell>{new Date(article.FechaCreacion).toLocaleDateString('es-ES')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewArticle(article)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {/* Mostrar botones de editar y eliminar para artículos en revisión (estado 1) o rechazados (estado 2) */}
                      {(article.Estatus === 1 || article.Estatus === 2) && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleAction("Editar", article.Titulo, article)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteArticle(article.IdArticulo)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No se encontraron artículos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) {
          setSelectedArticleResources([])
          setLoadingResources(false)
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedArticle?.Titulo}</DialogTitle>
            <DialogDescription>
              Publicado el {selectedArticle?.FechaCreacion ? new Date(selectedArticle.FechaCreacion).toLocaleDateString('es-ES') : 'Fecha no disponible'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-semibold">Resumen:</h4>
              <p className="text-sm text-muted-foreground">
                {selectedArticle?.Resumen || "Este artículo no tiene resumen."}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Contenido:</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {selectedArticle?.Contenido || "Este artículo no tiene contenido aún."}
              </p>
            </div>

            {/* Comentario del revisor */}
            {selectedArticle?.Comentario && (
              <div className="space-y-2">
                <h4 className="font-semibold">Comentario del revisor:</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    {selectedArticle.Comentario}
                  </p>
                </div>
              </div>
            )}

            {/* Recursos del artículo */}
            <div className="space-y-2">
              <h4 className="font-semibold">Recursos:</h4>
              {loadingResources ? (
                <div className="flex items-center justify-center py-4">
                  <div className="text-sm text-gray-500">Cargando recursos...</div>
                </div>
              ) : selectedArticleResources.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedArticleResources.map((resource, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm mb-1">{resource.Nombre}</p>
                          <div className="relative group">
                            <p 
                              className="text-xs text-gray-500 truncate pr-8 cursor-help"
                              title={resource.Ruta}
                            >
                              {resource.Ruta}
                            </p>
                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
                          </div>
                        </div>
                        <a 
                          href={resource.Ruta} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium whitespace-nowrap flex-shrink-0"
                        >
                          Ver
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Este artículo no tiene recursos asociados.
                </p>
              )}
            </div>

            
            {/* Debug: Mostrar información del artículo para debugging }
            {process.env.NODE_ENV === 'development' && (
              <div className="space-y-2">
                <h4 className="font-semibold text-xs text-gray-500">Debug Info:</h4>
                <pre className="text-xs text-gray-400 bg-gray-100 p-2 rounded">
                  {JSON.stringify(selectedArticle, null, 2)}
                </pre>
              </div>
            )*/}
            
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}