"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Eye, Edit, Trash2, Search, Filter } from "lucide-react"

const mockArticles = [
  {
    id: 1,
    title: "Nueva investigación en biotecnología",
    category: "investigaciones",
    status: "published",
    createdAt: "2024-01-15",
    content: "Investigadores han logrado avances significativos en la modificación genética de cultivos.",
    image: "https://via.placeholder.com/600x300?text=Biotecnología"
  },
  {
    id: 2,
    title: "Evento cultural de fin de año",
    category: "eventos",
    status: "pending",
    createdAt: "2024-01-14",
    content: "El evento incluirá danza, música y exposiciones artísticas.",
    image: "https://via.placeholder.com/600x300?text=Evento+Cultural"
  },
  {
    id: 3,
    title: "Convocatoria para becas de estudio",
    category: "convocatorias",
    status: "pending",
    createdAt: "2024-01-13",
    content: "Se abren nuevas convocatorias para becas en el extranjero para estudiantes destacados.",
    image: "https://via.placeholder.com/600x300?text=Becas"
  },
  {
    id: 4,
    title: "Proyecto de sostenibilidad ambiental",
    category: "proyectos",
    status: "rejected",
    createdAt: "2024-01-12",
    content: "En respuesta a la creciente crisis ambiental que afecta a los océanos, nace el proyecto Costas Limpias, una iniciativa integral que busca reducir el consumo de plásticos de un solo uso en comunidades costeras mediante educación, alternativas sostenibles y participación activa de los habitantes.",
    image: "https://images.pexels.com/photos/5864625/pexels-photo-5864625.jpeg"
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "published":
      return <Badge className="bg-green-100 text-green-800">Publicado</Badge>
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800">En Revisión</Badge>
    case "rejected":
      return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>
  }
}

export default function MyArticles() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("category")
  const [filterValue, setFilterValue] = useState("all")
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAction = (action: string, title: string) => {
    toast(`${action} artículo`, {
      description: `Acción "${action}" realizada en "${title}"`,
    })
  }

  const handleViewArticle = (article: any) => {
    setSelectedArticle(article)
    setIsDialogOpen(true)
  }

  const filteredArticles = mockArticles.filter((article) => {
    const matchSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase())
    let matchFilter = true

    if (filterValue !== "all") {
      switch (filterBy) {
        case "category":
          matchFilter = article.category === filterValue
          break
        case "status":
          matchFilter = article.status === filterValue
          break
        case "createdAt":
          matchFilter = article.createdAt === filterValue
          break
      }
    }

    return matchSearch && matchFilter
  })

  const getFilterOptions = () => {
    const options = new Set<string>()
    mockArticles.forEach((a) => {
      options.add(a[filterBy as keyof typeof a] as string)
    })
    return Array.from(options)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Mis Artículos</CardTitle>
            <CardDescription>Gestiona todos tus artículos creados</CardDescription>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            {/* Búsqueda */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                className="pl-10"
                placeholder="Buscar título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtro por campo */}
            <Select value={filterBy} onValueChange={(value) => {
              setFilterBy(value)
              setFilterValue("all")
            }}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">Categoría</SelectItem>
                <SelectItem value="status">Estado</SelectItem>
                <SelectItem value="createdAt">Fecha</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro por valor */}
            <Select value={filterValue} onValueChange={setFilterValue}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filtrar valor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {getFilterOptions().map((option) => (
                  <SelectItem key={option} value={option}>
                    {filterBy === "createdAt" ? option : option.charAt(0).toUpperCase() + option.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
              filteredArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell className="capitalize">{article.category.replace("-", " ")}</TableCell>
                  <TableCell>{getStatusBadge(article.status)}</TableCell>
                  <TableCell>{article.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewArticle(article)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {article.status === "rejected" && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleAction("Editar", article.title)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleAction("Eliminar", article.title)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
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

      {/* Modal de vista del artículo */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{selectedArticle?.title}</DialogTitle>
            <DialogDescription>Publicado el {selectedArticle?.createdAt}</DialogDescription>
          </DialogHeader>
           <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
      {selectedArticle?.image && (
        <img
          src={selectedArticle.image}
          alt="Imagen del artículo"
          className="rounded-md w-full h-auto object-cover"
        />
      )}
      <p className="text-sm text-muted-foreground whitespace-pre-line">
        {selectedArticle?.content || "Este artículo no tiene contenido aún."}
      </p>
    </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
