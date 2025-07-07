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
import { X, Upload, Send } from "lucide-react"

export default function ArticleEditor() {
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [files, setFiles] = useState<string[]>([])

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

  const handleSubmitForReview = () => {
    toast("Artículo enviado", {
      description: "Tu artículo ha sido enviado para revisión",
    })
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
              placeholder="Escribe un resumen breve del artículo"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
            />
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
              setTags((prev) => [...prev, tag])
            } else {
              setTags((prev) => prev.filter((t) => t !== tag))
            }
          }}
        />
        <Label htmlFor={tag} className="capitalize">{tag}</Label>
      </div>
    ))}
  </div>
</div>

          <div className="space-y-2">
            <Label>Archivos Multimedia</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Button type="button" onClick={handleFileUpload} variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Subir Archivos
              </Button>
              <p className="mt-2 text-sm text-gray-600">Haz clic para subir imágenes o videos</p>
            </div>
            {files.length > 0 && (
              <div className="space-y-2">
                <Label>Archivos seleccionados:</Label>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{file}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
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
