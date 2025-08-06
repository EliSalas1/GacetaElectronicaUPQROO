"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Link, X } from "lucide-react"

const resourceTypes = [
  { id: "imagen", label: "Imagen" },
  //{ id: "video", label: "Video" },
  { id: "pdf" }
]

interface GoogleDriveResource {
  idRecurso: string
  nombre: string
  ruta: string
}

interface GoogleDriveResourceDialogProps {
  onResourcesAdded: (resources: GoogleDriveResource[]) => void
  trigger?: React.ReactNode
}

export default function GoogleDriveResourceDialog({ onResourcesAdded, trigger }: GoogleDriveResourceDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [resources, setResources] = useState<GoogleDriveResource[]>([])
  const [currentResource, setCurrentResource] = useState({
    nombre: "",
    ruta: ""
  })

  // Función para agregar recurso manualmente (link)
  const handleAddResource = async () => {
    if (!currentResource.nombre) {
      toast.error("Debes seleccionar un tipo de recurso")
      return
    }
    if (!currentResource.ruta.trim()) {
      toast.error("El link es requerido")
      return
    }
    // Validar la URL usando la API
    const validation = await validateGoogleDriveUrl(currentResource.ruta, currentResource.nombre)
    if (!validation.valid) {
      toast.error(validation.error || "El link no es una URL válida de Google Drive")
      return
    }
    // Generar nombre automático
    const autoName = currentResource.nombre.charAt(0).toUpperCase() + currentResource.nombre.slice(1)
    const newResource: GoogleDriveResource = {
      idRecurso: Date.now().toString(),
      nombre: currentResource.nombre,
      ruta: currentResource.ruta
    }
    setResources([...resources, newResource])
    setCurrentResource({ nombre: "", ruta: "" })
    toast.success("Recurso agregado correctamente")
  }

  // Validación de URL
  const validateGoogleDriveUrl = async (url: string, nombre: string): Promise<{ valid: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/drive/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, nombre }),
      })
      const data = await response.json()
      if (!response.ok) {
        return { valid: false, error: data.error }
      }
      return { valid: data.valid, error: data.error }
    } catch (error) {
      console.error('Error validating URL:', error)
      return { valid: false, error: 'Error al validar la URL' }
    }
  }

  const removeResource = (id: string) => {
    setResources(resources.filter(resource => resource.idRecurso !== id))
  }

  const handleAccept = () => {
    if (resources.length === 0) {
      toast.error("Debes agregar al menos un recurso")
      return
    }
    onResourcesAdded(resources)
    setResources([])
    setIsOpen(false)
    toast.success("Recursos agregados al artículo")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Subir Archivos
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Recursos de Google Drive</DialogTitle>
          <DialogDescription>
            Agrega links de archivos de Google Drive para tu artículo. Solo se permiten archivos de tipo Imagen por el momento, gracias por su compresión.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información de tipos permitidos */}
          <div className="space-y-2">
            <Label>Formatos de archivos permitidos:</Label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong className="text-orange-600">Imagenes:</strong>
                  <p className="text-gray-600">PDF</p>
                  <p className="text-gray-600">Tipo .png</p>
                  <p className="text-gray-600">Tipo .jpg</p>
                  <p className="text-gray-600">Tipo .web</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario para agregar recurso manualmente */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="nombre">Tipo de archivo:</Label>
              <select
                id="nombre"
                className="w-full p-2 border rounded-md"
                value={currentResource.nombre}
                onChange={(e) => setCurrentResource({ ...currentResource, nombre: e.target.value })}
              >
                <option value="">Selecciona un tipo</option>
                {resourceTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ruta">Link de Google Drive:</Label>
              <Input
                id="ruta"
                placeholder="https://drive.google.com/file/d/..."
                value={currentResource.ruta}
                onChange={(e) => setCurrentResource({ ...currentResource, ruta: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                Ejemplos de URLs válidas:
                <br />• https://drive.google.com/file/d/[ID]/view?usp=sharing
                <br />• https://docs.google.com/document/d/[ID]/edit
                <br />• https://docs.google.com/spreadsheets/d/[ID]/edit
              </p>
            </div>
              <Button
                onClick={handleAddResource}
                  className="w-full bg-[#F3E9E9] text-[#4C0000] hover:bg-[#E6C6D6] rounded-xl font-medium transition cursor-pointer"
              >
                <Link className="mr-2 h-4 w-4" />
                Agregar Recurso
              </Button>
          </div>

          {/* Lista de recursos agregados */}
          {resources.length > 0 ? (
            <div className="space-y-4">
              <Label>Recursos de Google Drive agregados ({resources.length}):</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {resources.map((resource) => (
                  <div key={resource.idRecurso} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{resource.nombre}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeResource(resource.idRecurso)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Link className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No hay recursos agregados</p>
              <p className="text-xs">Completa el formulario para agregar recursos de Google Drive</p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleAccept}   className="flex-1 bg-white text-[#4C0000] border border-[#4C0000] hover:bg-[#4C0000] hover:text-white transition cursor-pointer">
              Aceptar
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}   className="flex-1 hover:bg-gray-200 cursor-pointer transition">
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 