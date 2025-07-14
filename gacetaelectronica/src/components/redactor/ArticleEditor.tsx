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
    link: string
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
    link: string
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

      // Simular el envío del artículo (aquí se enviaría a la API de artículos)
      console.log("Datos del artículo a enviar:", {
        title,
        summary,
        content,
        category,
        tags
      })

      // Enviar recursos de Google Drive si existen
      if (googleDriveResources.length > 0) {
        try {
          const response = await fetch('/api/recursos/batch', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              recursos: googleDriveResources.map(resource => ({
                nombre: resource.nombre,
                link: resource.link,
                tipo: resource.tipo
              })),
              articuloId: 1 // Esto debería ser el ID del artículo creado
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            toast.error(`Error al guardar recursos: ${errorData.message || 'Error desconocido'}`)
            return
          }

          const result = await response.json()
          console.log("Recursos guardados:", result)
          
          if (result.errors && result.errors.length > 0) {
            toast.warning(`Algunos recursos no se pudieron guardar: ${result.errors.join(', ')}`)
          }
        } catch (error) {
          console.error("Error al guardar recursos:", error)
          toast.error("Error al guardar los recursos de Google Drive")
          return
        }
      }

      toast.success("Artículo enviado", {
        description: "Tu artículo ha sido enviado para revisión",
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
            <Label>Recursos de Google Drive</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
          <Button onClick={handleSubmitForReview}>
            <Send className="mr-2 h-4 w-4" />
            Enviar a Revisión
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
