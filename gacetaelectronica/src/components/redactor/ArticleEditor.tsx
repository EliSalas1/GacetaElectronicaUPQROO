"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Upload, Send, Link } from "lucide-react"
import GoogleDriveResourceDialog from "./GoogleDriveResourceDialog"
import ResourcePreview from "./ResourcePreview"

export default function ArticleEditor() {
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [files, setFiles] = useState<string[]>([])
  const [googleDriveResources, setGoogleDriveResources] = useState<Array<{
    id: string
    nombre: string
    tipo: string
    ruta: string
  }>>([])

  const categories = [
    "noticias",
    "proyectos",
    "eventos",
    "actividades-culturales",
    "actividades-deportivas",
    "convocatorias",
    "investigaciones",
  ]

  // Mapeo de categorías a IDs (basado en la estructura de la BD)
  const categoryMapping: { [key: string]: number } = {
    "noticias": 1,
    "proyectos": 2,
    "eventos": 3,
    "actividades-culturales": 4,
    "actividades-deportivas": 5,
    "convocatorias": 6,
    "investigaciones": 7,
  }

  const availableTags = [
    "educación",
    "tecnología",
    "cultura",
    "deportes",
    "ciencia",
    "actualidad",
    "salud",
    "arte",
  ]


  const handleFileUpload = () => {
    const mockFiles = ["imagen1.jpg", "video1.mp4", "documento.pdf"]
    const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)]
    setFiles([...files, randomFile])
    toast("Archivo subido", {
      description: `${randomFile} se ha subido correctamente`,
    })
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleGoogleDriveResourcesAdded = (resources: Array<{
    id: string
    nombre: string
    tipo: string
    ruta: string
  }>) => {
    setGoogleDriveResources(resources)
  }

  const removeGoogleDriveResource = (id: string) => {
    setGoogleDriveResources(googleDriveResources.filter(resource => resource.id !== id))
  }

  const handleSubmitForReview = async () => {
    try {
      // Validar que se hayan completado los campos requeridos
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

      // Validar que la categoría existe en el mapeo
      if (!categoryMapping[category]) {
        toast.error("Categoría inválida seleccionada")
        return
      }

      // Validar que se haya agregado al menos 1 recurso de Google Drive
      if (googleDriveResources.length === 0) {
        toast.error("Debes agregar al menos 1 recurso de Google Drive", {
          description: "Haz clic en 'Agregar Recursos de Google Drive' para añadir imágenes, videos o documentos"
        })
        return
      }

      // Mostrar loading
      toast.loading("Enviando artículo...")

      // Preparar datos del artículo
      const articuloData = {
        Titulo: title.trim(),
        Resumen: summary.trim(),
        Contenido: content.trim(),
        IdCategoria: categoryMapping[category]
      }

      // Preparar recursos de Google Drive si existen
      const recursos = googleDriveResources.length > 0 ? 
        googleDriveResources.map(resource => ({
          nombre: resource.nombre,
          ruta: resource.ruta,
          tipo: resource.tipo
        })) : undefined

      // Preparar etiquetas si existen
      let etiquetas = undefined
      if (tags.length > 0) {
        try {
          // Obtener IDs de etiquetas por nombre
          const etiquetasResponse = await fetch('/api/etiquetas')
          if (etiquetasResponse.ok) {
            const etiquetasDisponibles = await etiquetasResponse.json()
            
            // Mapear nombres de etiquetas a IDs
            const etiquetaIds = tags.map(tagName => {
              const etiqueta = etiquetasDisponibles.find((e: any) => 
                e.Nombre.toLowerCase() === tagName.toLowerCase()
              )
              return etiqueta ? etiqueta.IdEtiqueta : null
            }).filter(id => id !== null)

            if (etiquetaIds.length > 0) {
              etiquetas = etiquetaIds
            }
          }
        } catch (error) {
          console.error("Error al obtener etiquetas:", error)
          // Continuamos sin etiquetas
        }
      }

      // Crear artículo con todas las relaciones en una sola transacción
      const response = await fetch('/api/articulos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...articuloData,
          recursos,
          etiquetas
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(`Error al enviar artículo: ${errorData.message || 'Error desconocido'}`)
        return
      }

      const result = await response.json()
      console.log("Artículo enviado correctamente:", result)

      toast.success("Artículo enviado correctamente", {
        description: `Tu artículo ha sido enviado para revisión${result.recursosGuardados ? ` con ${result.recursosGuardados} recursos` : ''}${result.etiquetasGuardadas ? ` y ${result.etiquetasGuardadas} etiquetas` : ''}`,
      })

      // Limpiar el formulario
      setTitle("")
      setSummary("")
      setContent("")
      setCategory("")
      setTags([])
      setGoogleDriveResources([])

    } catch (error) {
      toast.error("Error al enviar el artículo")
      console.error("Error:", error)
    }
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


  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo Artículo</CardTitle>
        <CardDescription>Completa todos los campos para crear un artículo para la gaceta electrónica</CardDescription>
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
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
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

                  />
                  <Label htmlFor={tag} className="capitalize">{tag}</Label>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500">
              {tags.length} / 3 etiquetas seleccionadas
            </p>
            
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
                Agrega links de archivos de Google Drive (Imagen, Video, PDF)
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
                      key={resource.id}
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
            className={googleDriveResources.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
          >
            <Send className="mr-2 h-4 w-4" />
            Enviar a Revisión
            {googleDriveResources.length === 0 && (
              <span className="ml-2 text-xs"></span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
