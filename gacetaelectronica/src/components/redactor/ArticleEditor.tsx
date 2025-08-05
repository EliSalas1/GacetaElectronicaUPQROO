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
import {Send, Link } from "lucide-react"
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
    Categoria?: {
      IdCategoria: number
      Nombre: string
    }
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
  const [files, setFiles] = useState<string[]>([])
  const [googleDriveResources, setGoogleDriveResources] = useState<Array<{
    idRecurso: string
    nombre: string
    ruta: string
  }>>([])
  const [categories, setCategories] = useState<Array<{
    IdCategoria: number
    Nombre: string
  }>>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [loadingTags, setLoadingTags] = useState(true)

  // Función para cargar categorías desde la base de datos
  const loadCategories = async () => {
    try {
      setLoadingCategories(true)
      const response = await fetch('/api/categorias')
      if (response.ok) {
        const categoriesData = await response.json()
        setCategories(categoriesData)
      } else {
        console.error('Error al cargar categorías')
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error)
    } finally {
      setLoadingCategories(false)
    }
  }

  // Función para cargar etiquetas desde la base de datos
  const loadTags = async () => {
    try {
      setLoadingTags(true)
      const response = await fetch('/api/etiquetas')
      if (response.ok) {
        const tagsData = await response.json()
        const tagNames = tagsData.map((tag: any) => tag.Nombre)
        setAvailableTags(tagNames)
      } else {
        console.error('Error al cargar etiquetas')
      }
    } catch (error) {
      console.error('Error al cargar etiquetas:', error)
    } finally {
      setLoadingTags(false)
    }
  }

  // Cargar categorías y etiquetas al montar el componente
  useEffect(() => {
    loadCategories()
    loadTags()
  }, [])

  // Cargar datos del artículo si estamos en modo edición
  useEffect(() => {
    console.log('ArticleEditor useEffect:', { editMode, articleData })
    
    if (editMode && articleData) {
      // Asegurar que tenemos el ID del artículo (puede venir como IdArticulo o idArticulo)
      const articleId = articleData.IdArticulo || articleData.idArticulo
      
      if (articleId) {
        console.log('Cargando datos del artículo:', articleId)
        setTitle(articleData.Titulo || "")
        setSummary(articleData.Resumen || "")
        setContent(articleData.Contenido || "")
        
        // Establecer la categoría directamente por ID
        setCategory(articleData.IdCategoria?.toString() || "")

        // Cargar etiquetas del artículo si existen
        loadArticleTags(articleId)
        
        // Cargar recursos del artículo si existen
        loadArticleResources(articleId)
      } else {
        console.warn('No se encontró ID del artículo en:', articleData)
      }
    }
  }, [editMode, articleData])

  // Función para cargar etiquetas del artículo
  const loadArticleTags = async (articleId: number) => {
    console.log('Cargando etiquetas para artículo:', articleId)
    
    if (!articleId) {
      console.warn('No se proporcionó ID de artículo para cargar etiquetas')
      return
    }
    
    try {
      const response = await fetch(`/api/articuloEtiqueta?articuloId=${articleId}`)
      console.log('Respuesta de etiquetas:', response.status)
      if (response.ok) {
        const etiquetas = await response.json()
        console.log('Etiquetas obtenidas:', etiquetas)
        // Mapear IDs de etiquetas a nombres
        const tagNames = await Promise.all(
          etiquetas.map(async (etiqueta: any) => {
            try {
              const etiquetaResponse = await fetch(`/api/etiquetas?id=${etiqueta.idEtiqueta}`)
              if (etiquetaResponse.ok) {
                const etiquetaData = await etiquetaResponse.json()
                return etiquetaData.Nombre
              }
              return null
            } catch (error) {
              console.error('Error al obtener etiqueta:', error)
              return null
            }
          })
        )
        setTags(tagNames.filter(tag => tag !== null))
      }
    } catch (error) {
      console.error('Error al cargar etiquetas del artículo:', error)
    }
  }

  // Función para cargar recursos del artículo
  const loadArticleResources = async (articleId: number) => {
    console.log('Cargando recursos para artículo:', articleId)
    
    if (!articleId) {
      console.warn('No se proporcionó ID de artículo para cargar recursos')
      return
    }
    
    try {
      const response = await fetch(`/api/recursos?articuloId=${articleId}`)
      console.log('Respuesta de recursos:', response.status)
      if (response.ok) {
        const recursos = await response.json()
        console.log('Recursos obtenidos:', recursos)
        const formattedResources = recursos.map((recurso: any) => ({
          idRecurso: recurso.IdRecurso,
          nombre: recurso.Nombre,
          ruta: recurso.Ruta
        }))
        setGoogleDriveResources(formattedResources)
      }
    } catch (error) {
      console.error('Error al cargar recursos del artículo:', error)
    }
  }


  /*const handleFileUpload = () => {
    const mockFiles = ["imagen1.jpg", "video1.mp4", "documento.pdf"]
    const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)]
    setFiles([...files, randomFile])
    toast("Archivo subido", {
      description: `${randomFile} se ha subido correctamente`,
    })
  }*/

  const handleGoogleDriveResourcesAdded = (resources: Array<{
    idRecurso: string
    nombre: string
    ruta: string
  }>) => {
    setGoogleDriveResources(resources)
  }

  const removeGoogleDriveResource = (id: string) => {
    setGoogleDriveResources(googleDriveResources.filter(resource => resource.idRecurso !== id))
  }

  const handleSubmitForReview = async () => {
    // Validar campos antes de enviar
    if (!title.trim()) {
      toast.error("El título es requerido")
      return
    }
  
    if (!summary.trim()) {
      toast.error("El resumen es requerido")
      return
    }
  
    if (!content.trim()) {
      toast.error("El contenido es requerido")
      return
    }
  
    if (!category) {
      toast.error("Debes seleccionar una categoría")
      return
    }
  
    const selectedCategory = categories.find(cat => cat.IdCategoria.toString() === category)
    if (!selectedCategory) {
      toast.error("Categoría inválida seleccionada")
      return
    }
  
    if (googleDriveResources.length === 0) {
      toast.error("Debes agregar al menos 1 recurso de Google Drive", {
        description: "Haz clic en 'Agregar Recursos de Google Drive' para añadir imágenes, videos o documentos"
      })
      return
    }
  
    await toast.promise(async () => {
      // Preparar datos del artículo
      const articuloData = {
        Titulo: title.trim(),
        Resumen: summary.trim(),
        Contenido: content.trim(),
        IdCategoria: parseInt(category),
        usuarioId: userInfo?.id
      }
  
      const recursos = googleDriveResources.map(resource => ({
        idRecurso: resource.idRecurso,
        nombre: resource.nombre,
        ruta: resource.ruta,
      }))
  
      let etiquetas = undefined
      if (tags.length > 0) {
        try {
          const etiquetasResponse = await fetch('/api/etiquetas')
          if (etiquetasResponse.ok) {
            const etiquetasDisponibles = await etiquetasResponse.json()
            const etiquetaIds = tags.map(tagName => {
              const etiqueta = etiquetasDisponibles.find((e: any) =>
                e.Nombre.toLowerCase() === tagName.toLowerCase()
              )
              return etiqueta ? etiqueta.IdEtiqueta : null
            }).filter(id => id !== null)
            if (etiquetaIds.length > 0) etiquetas = etiquetaIds
          }
        } catch (error) {
          console.error("Error al obtener etiquetas:", error)
        }
      }
  
      const requestBody = {
        ...articuloData,
        recursos,
        etiquetas
      }
  
      let response
      if (editMode && articleData) {
        response = await fetch(`/api/articulos?id=${articleData.IdArticulo}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        })
      } else {
        response = await fetch('/api/articulos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        })
      }
  
      const result = await response.json()
  
      if (!response.ok) {
        throw new Error(result.message || "Error desconocido")
      }
  
      // Mostrar toast final según el modo
      toast.success(editMode ? "Artículo actualizado correctamente" : "Artículo enviado correctamente", {
        description: editMode 
          ? `Tu artículo ha sido actualizado${result.recursosGuardados ? ` con ${result.recursosGuardados} recursos` : ''}${result.etiquetasGuardadas ? ` y ${result.etiquetasGuardadas} etiquetas` : ''}`
          : `Tu artículo ha sido enviado para revisión${result.recursosGuardados ? ` con ${result.recursosGuardados} recursos` : ''}${result.etiquetasGuardadas ? ` y ${result.etiquetasGuardadas} etiquetas` : ''}`
      })
  
      // Limpiar formulario o ejecutar callback
      if (editMode && onArticleUpdated) {
        onArticleUpdated()
      } else {
        setTitle("")
        setSummary("")
        setContent("")
        setCategory("")
        setTags([])
        setGoogleDriveResources([])
      }
  
    }, {
      loading: editMode ? "Actualizando artículo..." : "Enviando artículo...",
      success: false, // para evitar duplicar mensaje si usamos toast.success() nosotros mismos
      error: (err: any) => `Error al ${editMode ? 'actualizar' : 'enviar'} artículo: ${err.message}`
    })
  }
  

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length

    if (wordCount <= 300) {
      setSummary(text)
    } else {
      toast.error("El resumen no puede exceder las 300 palabras.")
    }
  }

  console.log("Recursos actuales:", googleDriveResources);



  return (
    <Card>
      <CardHeader>
        <CardTitle>{editMode ? 'Editar Artículo' : 'Nuevo Artículo'}</CardTitle>
        <CardDescription>
          {editMode 
            ? 'Modifica los campos del artículo para actualizarlo en la gaceta electrónica'
            : 'Completa todos los campos para crear un artículo para la gaceta electrónica'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título del Artículo</Label>
            <Input
              id="title"
              placeholder="Ingresa el título del artículo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder={loadingCategories ? "Cargando categorías..." : "Selecciona una categoría"} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.IdCategoria} value={cat.IdCategoria.toString()}>
                    {cat.Nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Resumen</Label>
            <Textarea
              id="summary"
              placeholder="Escribe un resumen breve del artículo (máx. 300 palabras)"
              value={summary}
              onChange={handleSummaryChange}
              rows={3}
            />

            <p className="text-sm text-gray-500">
              {summary.trim().split(/\s+/).filter(Boolean).length} / 300 palabras
            </p>

          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenido Completo</Label>
            <Textarea
              id="content"
              placeholder="Escribe el contenido completo del artículo"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
            />
          </div>

          <div className="space-y-2">
            <Label>Etiquetas</Label>
            {loadingTags ? (
              <div className="flex items-center justify-center py-4">
                <div className="text-sm text-gray-500">Cargando etiquetas...</div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableTags.map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                     <Checkbox
                        id={tag}
                        checked={tags.includes(tag)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            if (tags.length < 3) {
                              setTags((prev) => [...prev, tag])
                            } else {
                              toast.error("Solo puedes seleccionar hasta 3 etiquetas.")
                            }
                          } else {
                            setTags((prev) => prev.filter((t) => t !== tag))
                          }
                        }}
                        className="data-[state=checked]:bg-[#FF6400] data-[state=checked]:text-white data-[state=checked]:border-transparent"
                      />
                      <Label htmlFor={tag} className="capitalize">{tag}</Label>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-gray-500">
                  {tags.length} / 3 etiquetas seleccionadas
                </p>
              </>
            )}
          </div>


          <div className="space-y-2">
            <Label>Recursos de Google Drive *</Label>
            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
              googleDriveResources.length === 0 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300'
            }`}>
              <GoogleDriveResourceDialog 
                onResourcesAdded={handleGoogleDriveResourcesAdded}
                trigger={
                  <Button type="button" variant="outline">
                    <Link className="mr-2 h-4 w-4" />
                    Agregar Recursos de Google Drive
                  </Button>
                }
              />
              <p className="mt-2 text-sm text-gray-600">
                Agrega links de archivos de Google Drive (Imagen)
              </p>
              {googleDriveResources.length === 0 && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                  ⚠️ Se requiere al menos 1 recurso para enviar el artículo
                </p>
              )}
            </div>
            
            {/* Mostrar recursos de Google Drive agregados con vista previa */}
            {googleDriveResources.length > 0 ? (
              <div className="space-y-4">
                <Label>Recursos de Google Drive agregados ({googleDriveResources.length}):</Label>   
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {googleDriveResources.map((resource) => (
                    <ResourcePreview
                      key={resource.idRecurso}
                      resource={resource}
                      onRemove={removeGoogleDriveResource}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Link className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No hay recursos agregados</p>
                <p className="text-xs">Haz clic en "Agregar Recursos de Google Drive" para comenzar</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            onClick={handleSubmitForReview}
            disabled={googleDriveResources.length === 0}
            className={`w-full sm:w-auto bg-[#4C0000] text-white border border-[#4C0000] hover:bg-white hover:text-[#4C0000] transition ${
              googleDriveResources.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Send className="mr-2 h-4 w-4" />
            {editMode ? 'Actualizar Artículo' : 'Enviar a Revisión'}

            {googleDriveResources.length === 0 && (
              <span className="ml-2 text-xs"></span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
