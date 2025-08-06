"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Link, Send } from "lucide-react"
import GoogleDriveResourceDialog from "./GoogleDriveResourceDialog"
import ResourcePreview from "./ResourcePreview"
import { useSessionUser } from "@/hooks/useSessionUser"

interface ArticleEditorProps {
  editMode?: boolean
  articleData?: {
    IdArticulo?: number
    idArticulo?: number
    Titulo: string
    Resumen: string
    Contenido: string
    IdCategoria: number
    Categoria?: { IdCategoria: number; Nombre: string }
    Estatus?: number
  }
  onArticleUpdated?: () => void
}

export default function ArticleEditor({ editMode = false, articleData, onArticleUpdated }: ArticleEditorProps) {
  const { userInfo } = useSessionUser()
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [googleDriveResources, setGoogleDriveResources] = useState<Array<{ idRecurso: string; nombre: string; ruta: string }>>([])
  const [categories, setCategories] = useState<Array<{ IdCategoria: number; Nombre: string }>>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingTags, setLoadingTags] = useState(true)

  useEffect(() => { loadCategories(); loadTags() }, [])

  useEffect(() => {
    if (editMode && articleData) {
      const articleId = articleData.IdArticulo || articleData.idArticulo
      setTitle(articleData.Titulo || "")
      setSummary(articleData.Resumen || "")
      setContent(articleData.Contenido || "")
      setCategory(articleData.IdCategoria?.toString() || "")
      if (articleId) { loadArticleTags(articleId); loadArticleResources(articleId) }
    }
  }, [editMode, articleData])

  const loadCategories = async () => {
    try {
      setLoadingCategories(true)
      const r = await fetch('/api/categorias')
      if (r.ok) setCategories(await r.json())
    } finally { setLoadingCategories(false) }
  }

  const loadTags = async () => {
    try {
      setLoadingTags(true)
      const r = await fetch('/api/etiquetas')
      if (r.ok) setAvailableTags((await r.json()).map((t: any) => t.Nombre))
    } finally { setLoadingTags(false) }
  }

  const loadArticleTags = async (id: number) => {
    try {
      const r = await fetch(`/api/articuloEtiqueta?articuloId=${id}`)
      if (!r.ok) return
      const etiquetas = await r.json()
      const names = await Promise.all(etiquetas.map(async (et: any) => {
        const er = await fetch(`/api/etiquetas?id=${et.idEtiqueta}`)
        return er.ok ? (await er.json()).Nombre : null
      }))
      setTags(names.filter(Boolean))
    } catch { }
  }

  const loadArticleResources = async (id: number) => {
    try {
      const r = await fetch(`/api/recursos?articuloId=${id}`)
      if (r.ok) {
        const rec = await r.json()
        setGoogleDriveResources(rec.map((re: any) => ({ idRecurso: re.IdRecurso, nombre: re.Nombre, ruta: re.Ruta })))
      }
    } catch { }
  }

  const handleGoogleDriveResourcesAdded = (res: Array<{ idRecurso: string; nombre: string; ruta: string }>) =>
    setGoogleDriveResources(res)
  const removeGoogleDriveResource = (id: string) =>
    setGoogleDriveResources(googleDriveResources.filter(r => r.idRecurso !== id))
  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    e.target.value.trim().split(/\s+/).filter(Boolean).length <= 300
      ? setSummary(e.target.value)
      : toast.error("El resumen no puede exceder las 300 palabras.")

  const handleSubmitForReview = async () => {
    if (!title.trim() || !summary.trim() || !content.trim() || !category || googleDriveResources.length === 0)
      return toast.error("Completa todos los campos requeridos y agrega al menos un recurso.")
    const selectedCategory = categories.find(cat => cat.IdCategoria.toString() === category)
    if (!selectedCategory) return toast.error("Categoría inválida")

    let etiquetas: number[] | undefined
    if (tags.length > 0) {
      const etiquetasDisponibles = await fetch('/api/etiquetas').then(r => r.ok ? r.json() : [])
      etiquetas = tags.map(tagName => {
        const e = etiquetasDisponibles.find((et: any) => et.Nombre.toLowerCase() === tagName.toLowerCase())
        return e ? e.IdEtiqueta : null
      }).filter((id: number | null) => id !== null) as number[]
    }

    const requestBody: any = {
      Titulo: title.trim(),
      Resumen: summary.trim(),
      Contenido: content.trim(),
      IdCategoria: parseInt(category),
      usuarioId: userInfo?.id,
      recursos: googleDriveResources.map(r => ({ idRecurso: r.idRecurso, nombre: r.nombre, ruta: r.ruta })),
      etiquetas
    }

    await toast.promise(async () => {
      let response
      const articleId = articleData?.IdArticulo || articleData?.idArticulo
      if (editMode && articleId) {
        if (articleData?.Estatus === 2) requestBody.Estatus = 0
        response = await fetch(`/api/articulos?id=${articleId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody)
        })
      } else {
        response = await fetch('/api/articulos', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody)
        })
      }
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || "Error desconocido")

      toast.success(editMode ? "Artículo actualizado correctamente" : "Artículo enviado correctamente")
      editMode && onArticleUpdated
        ? onArticleUpdated()
        : (setTitle(""), setSummary(""), setContent(""), setCategory(""), setTags([]), setGoogleDriveResources([]))
    }, { loading: editMode ? "Actualizando artículo..." : "Enviando artículo...", success: false, error: (err: any) => `Error al ${editMode ? 'actualizar' : 'enviar'} artículo: ${err.message}` })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editMode ? 'Editar Artículo' : 'Nuevo Artículo'}</CardTitle>
        <CardDescription>{editMode ? 'Modifica tu artículo rechazado o publicado' : 'Completa todos los campos para crear un artículo'}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título del Artículo</Label>
            <Input id="title" placeholder="Ingresa el título" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder={loadingCategories ? "Cargando categorías..." : "Selecciona una categoría"} />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => <SelectItem key={cat.IdCategoria} value={cat.IdCategoria.toString()}>{cat.Nombre}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">Resumen</Label>
            <Textarea id="summary" placeholder="Máx. 300 palabras" value={summary} onChange={handleSummaryChange} rows={3} />
            <p className="text-sm text-gray-500">{summary.trim().split(/\s+/).filter(Boolean).length} / 300 palabras</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Contenido Completo</Label>
            <Textarea id="content" placeholder="Contenido completo" value={content} onChange={e => setContent(e.target.value)} rows={10} />
          </div>
          <div className="space-y-2">
            <Label>Etiquetas</Label>
            {loadingTags ? <div className="text-sm text-gray-500">Cargando etiquetas...</div> :
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableTags.map(tag =>
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox id={tag} checked={tags.includes(tag)} onCheckedChange={(c) =>
                        c ? (tags.length < 3 ? setTags([...tags, tag]) : toast.error("Máx 3 etiquetas"))
                          : setTags(tags.filter(t => t !== tag))
                      } />
                      <Label htmlFor={tag}>{tag}</Label>
                    </div>)}
                </div>
                <p className="text-sm text-gray-500">{tags.length} / 3 etiquetas seleccionadas</p>
              </>}
          </div>
          <div className="space-y-2">
            <Label>Recursos de Google Drive *</Label>
            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${googleDriveResources.length === 0 ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
              <GoogleDriveResourceDialog onResourcesAdded={handleGoogleDriveResourcesAdded}
                trigger={<Button type="button" variant="outline"><Link className="mr-2 h-4 w-4" />Agregar Recursos</Button>} />
              <p className="mt-2 text-sm text-gray-600">Agrega links de archivos de Google Drive (Imagen, Video, PDF)</p>
              {googleDriveResources.length === 0 && <p className="mt-2 text-sm text-red-600 font-medium">⚠️ Se requiere al menos 1 recurso</p>}
            </div>
            {googleDriveResources.length > 0 &&
              <div className="space-y-4">
                <Label>Recursos agregados ({googleDriveResources.length}):</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {googleDriveResources.map(r => <ResourcePreview key={r.idRecurso} resource={r} onRemove={removeGoogleDriveResource} />)}
                </div>
              </div>}
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <Button onClick={handleSubmitForReview} disabled={googleDriveResources.length === 0} className={googleDriveResources.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}>
            <Send className="mr-2 h-4 w-4" />{editMode ? 'Actualizar Artículo' : 'Enviar a Revisión'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
