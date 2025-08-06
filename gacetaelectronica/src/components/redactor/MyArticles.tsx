"use client"

import { useState, useEffect, useCallback } from "react"
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
  IdArticulo: number
  Titulo: string
  Resumen: string
  Contenido: string
  Estatus: number
  FechaCreacion: string
  FechaRevision?: string
  Comentario?: string
  IdCategoria: number
  Categoria?: {
    IdCategoria: number
    Nombre: string
  }
}

interface MyArticlesProps {
  onEditArticle?: (article: Articulo) => void
}

const getStatusBadge = (status: number) => {
  switch (status) {
    case 0:
      return <Badge className="bg-yellow-100 text-yellow-800">En Revisión</Badge>
    case 1:
      return <Badge className="bg-green-100 text-green-800">Publicado</Badge>
    case 2:
      return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-800">Desconocido</Badge>
  }
}

const getStatusText = (status: number) => {
  switch (status) {
    case 0: return "En Revisión"
    case 1: return "Publicado"
    case 2: return "Rechazado"
    default: return "Desconocido"
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
  const [selectedArticleResources, setSelectedArticleResources] = useState<any[]>([])
  const [loadingResources, setLoadingResources] = useState(false)

  const loadUserArticles = useCallback(async () => {
    if (!userInfo?.id) {
      setError('No se pudo identificar al usuario')
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const userId = userInfo.id
      const resp = await fetch(`/api/articuloUsuario?usuarioId=${userId}`)
      if (!resp.ok) throw new Error('Error al cargar los artículos')
      const userArticles = await resp.json()

      const detailed = await Promise.all(
        userArticles.map(async (a: any) => {
          const articleId = a.IdArticulo || a.idArticulo
          if (!articleId) return null
          const r = await fetch(`/api/articulos?id=${articleId}&include=categoria`)
          if (!r.ok) return null
          const raw = await r.json()
          const mapped: Articulo = {
            IdArticulo: articleId,
            Titulo: raw.Titulo,
            Resumen: raw.Resumen,
            Contenido: raw.Contenido,
            FechaCreacion: raw.createdAt,
            FechaRevision: raw.reviewedAt,
            Comentario: raw.comment,
            Estatus: ({ published: 1, pending: 0, rejected: 2, unknown: 0 } as any)[raw.status] ?? 0,
            IdCategoria: raw.IdCategoria || 0,
            Categoria: {
              IdCategoria: raw.IdCategoria || 0,
              Nombre: raw.Categoria || raw.category || 'Sin categoría'
            }
          }
          return mapped
        })
      )

      setArticles(detailed.filter((x): x is Articulo => x !== null))
    } catch (err) {
      console.error(err)
      setError('Error al cargar los artículos')
    } finally {
      setLoading(false)
    }
  }, [userInfo?.id])


  useEffect(() => {
    if (!userLoading && userInfo?.id) loadUserArticles()
  }, [userLoading, userInfo?.id, loadUserArticles]);

  const handleViewArticle = async (article: Articulo) => {
    setSelectedArticle(article)
    setIsDialogOpen(true)
    setLoadingResources(true)
    try {
      const r = await fetch(`/api/recursos?articuloId=${article.IdArticulo}`)
      if (r.ok) setSelectedArticleResources(await r.json())
      else setSelectedArticleResources([])
    } catch {
      setSelectedArticleResources([])
    } finally {
      setLoadingResources(false)
    }
  }

  const handleDeleteArticle = async (id: number) => {
    try {
      const r = await fetch(`/api/articulos?id=${id}`, { method: 'DELETE' })
      if (!r.ok) throw new Error(await r.text())
      toast('Artículo eliminado', { description: 'El artículo ha sido eliminado correctamente' })
      loadUserArticles()
    } catch (err) {
      console.error(err)
      toast('Error al eliminar', { description: 'No se pudo eliminar el artículo' })
    }
  }

  const handleAction = (action: string, title: string, art?: Articulo) => {
    if (action === "Editar" && art && onEditArticle) onEditArticle(art)
    else toast(`${action} artículo`, { description: `Acción "${action}" en "${title}"` })
  }

  const filtered = articles.filter(a => {
    if (!a.Titulo) return false
    const bySearch = a.Titulo.toLowerCase().includes(searchTerm.toLowerCase())
    let byFilter = true
    if (filterValue !== "all") {
      if (filterBy === "category") byFilter = a.Categoria?.Nombre === filterValue
      if (filterBy === "status") byFilter = getStatusText(a.Estatus) === filterValue
      if (filterBy === "createdAt") byFilter = a.FechaCreacion === filterValue
    }
    return bySearch && byFilter
  })

  const getFilterOptions = (field: string) => {
    const s = new Set<string>()
    articles.forEach(a => {
      if (field === "category" && a.Categoria?.Nombre) s.add(a.Categoria.Nombre)
      if (field === "status") s.add(getStatusText(a.Estatus))
      if (field === "createdAt") s.add(a.FechaCreacion)
    })
    return Array.from(s)
  }

  if (loading || userLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mis Artículos</CardTitle>
          <CardDescription>Cargando...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
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
          <CardDescription>Error</CardDescription>
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
      <CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <CardTitle>Mis Artículos</CardTitle>
          <CardDescription>Gestiona tus artículos</CardDescription>
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
            {filtered.length > 0 ? filtered.map((art, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{art.Titulo}</TableCell>
                <TableCell>{art.Categoria?.Nombre || 'Sin categoría'}</TableCell>
                <TableCell>{getStatusBadge(art.Estatus)}</TableCell>
                <TableCell>{new Date(art.FechaCreacion).toLocaleDateString('es-ES')}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewArticle(art)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {/* Editar solo para artículos rechazados (estado 2) */}
                    {art.Estatus === 2 && (
                      <Button variant="ghost" size="sm" onClick={() => handleAction("Editar", art.Titulo, art)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {/* Eliminar para todos los estados */}
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteArticle(art.IdArticulo)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No se encontraron artículos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={open => {
        setIsDialogOpen(open)
        if (!open) setSelectedArticleResources([])
      }}>
        <DialogContent className="w-full max-w-[40%] sm:max-w-[60rem] max-h-[90vh] overflow-y-auto px-6">
          <DialogHeader>
            <DialogTitle>Información del Artículo</DialogTitle>
            <DialogDescription>
              Todos los detalles del artículo seleccionado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 px-1 py-2">
            {/* Datos Generales */}
            <section className="border-b pb-4">
              <h3 className="font-semibold text-lg mb-2 text-orange-800">Datos Generales</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <p><strong>Título:</strong> {selectedArticle?.Titulo}</p>
                <p><strong>Autor:</strong> {userInfo?.name ?? "Desconocido"}</p>
                <p><strong>Categoría:</strong> {selectedArticle?.Categoria?.Nombre}</p>
                <p><strong>Estado:</strong> {getStatusText(selectedArticle?.Estatus || 0)}</p>
                <p><strong>Fecha de Creación:</strong> {selectedArticle?.FechaCreacion && new Date(selectedArticle.FechaCreacion).toLocaleDateString("es-ES")}</p>
              </div>
            </section>

            {/* Resumen */}
            <section className="border-b pb-4">
              <h3 className="font-semibold text-lg mb-2 text-orange-800">Resumen</h3>
              <p className="text-sm text-justify whitespace-pre-line">
                {selectedArticle?.Resumen || "—"}
              </p>
            </section>

            {/* Contenido */}
            <section>
              <h3 className="font-semibold text-lg mb-2 text-orange-800">Contenido Completo</h3>
              <div className="text-sm whitespace-pre-line text-justify leading-relaxed">
                {selectedArticle?.Contenido || "Sin contenido disponible"}
              </div>
            </section>

            {/* Comentario (opcional) */}
            {selectedArticle?.Comentario && (
              <section>
                <h3 className="font-semibold text-lg mb-2 text-orange-800">Comentario del Revisor</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800 whitespace-pre-line">{selectedArticle.Comentario}</p>
                </div>
              </section>
            )}

            {/* Recursos */}
            <section>
              <h3 className="font-semibold text-lg mb-2 text-orange-800">Recursos</h3>
              {loadingResources ? (
                <div className="py-4 text-center text-sm text-gray-500">
                  Cargando recursos...
                </div>
              ) : selectedArticleResources.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedArticleResources.map((res, i) => (
                    <div key={i} className="border rounded-lg p-3 bg-gray-50">
                      <p className="font-medium text-sm mb-1">{res.Nombre}</p>
                      <p className="text-xs text-gray-500 truncate" title={res.Ruta}>
                        {res.Ruta}
                      </p>
                      <a
                        href={res.Ruta}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Ver
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No hay recursos.</p>
              )}
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
