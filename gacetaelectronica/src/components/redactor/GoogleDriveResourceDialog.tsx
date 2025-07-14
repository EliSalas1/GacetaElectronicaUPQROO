"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Link, X, FolderOpen } from "lucide-react"

// @ts-ignore
// eslint-disable-next-line
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""
const DEVELOPER_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""
const APP_ID = process.env.NEXT_PUBLIC_GOOGLE_APP_ID || ""

const resourceTypes = [
  { id: "imagen", label: "Imagen" },
  { id: "video", label: "Video" },
  { id: "pdf", label: "PDF" }
]

interface GoogleDriveResource {
  id: string
  nombre: string
  tipo: string
  link: string
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
    tipo: "",
    link: ""
  })
  const pickerLoaded = useRef(false)

  // Cargar el script de Google Picker
  useEffect(() => {
    if (!window.google && !document.getElementById("google-picker")) {
      const script = document.createElement("script")
      script.src = "https://apis.google.com/js/api.js"
      script.id = "google-picker"
      script.onload = () => {
        pickerLoaded.current = true
      }
      document.body.appendChild(script)
    } else {
      pickerLoaded.current = true
    }
  }, [])

  // Función para abrir el Picker
  const handleOpenPicker = () => {
    if (!pickerLoaded.current) {
      toast.error("Google Picker aún no está listo. Espera unos segundos e intenta de nuevo.")
      return
    }
    // Cargar las APIs necesarias
    window.gapi.load("auth", { callback: onAuthApiLoad })
    window.gapi.load("picker", { callback: onPickerApiLoad })
  }

  // Estado para saber si la API Picker está lista
  const [pickerApiLoaded, setPickerApiLoaded] = useState(false)
  const [oauthToken, setOauthToken] = useState<string | null>(null)

  function onAuthApiLoad() {
    window.gapi.auth.authorize(
      {
        client_id: CLIENT_ID,
        scope: ["https://www.googleapis.com/auth/drive.readonly"],
        immediate: false,
      },
      handleAuthResult
    )
  }

  function onPickerApiLoad() {
    setPickerApiLoaded(true)
  }

  function handleAuthResult(authResult: any) {
    if (authResult && !authResult.error) {
      setOauthToken(authResult.access_token)
      createPicker(authResult.access_token)
    } else {
      toast.error("No se pudo autenticar con Google Drive")
    }
  }

  function createPicker(token: string) {
    if (!pickerApiLoaded) {
      toast.error("Google Picker aún no está listo.")
      return
    }
    const view = new window.google.picker.DocsView()
      .setIncludeFolders(false)
      .setSelectFolderEnabled(false)
      .setMimeTypes("image/png,image/jpeg,image/jpg,image/gif,video/mp4,application/pdf")
    const picker = new window.google.picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(token)
      .setDeveloperKey(DEVELOPER_KEY)
      .setAppId(APP_ID)
      .setCallback(pickerCallback)
      .build()
    picker.setVisible(true)
  }

  function pickerCallback(data: any) {
    if (data.action === window.google.picker.Action.PICKED) {
      const file = data.docs[0]
      // Determinar tipo
      let tipo = ""
      if (file.mimeType.startsWith("image/")) tipo = "imagen"
      else if (file.mimeType.startsWith("video/")) tipo = "video"
      else if (file.mimeType === "application/pdf") tipo = "pdf"
      else tipo = "archivo"
      // Usar webViewLink como link
      const newResource: GoogleDriveResource = {
        id: file.id,
        nombre: file.name,
        tipo,
        link: file.url || file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`
      }
      setResources([...resources, newResource])
      toast.success("Archivo añadido desde Google Drive")
    }
  }

  // Función para agregar recurso manualmente (link)
  const handleAddResource = async () => {
    if (!currentResource.tipo) {
      toast.error("Debes seleccionar un tipo de recurso")
      return
    }
    if (!currentResource.link.trim()) {
      toast.error("El link es requerido")
      return
    }
    // Validar la URL usando la API
    const validation = await validateGoogleDriveUrl(currentResource.link, currentResource.tipo)
    if (!validation.valid) {
      toast.error(validation.error || "El link no es una URL válida de Google Drive")
      return
    }
    // Generar nombre automático
    const autoName = currentResource.tipo.charAt(0).toUpperCase() + currentResource.tipo.slice(1)
    const newResource: GoogleDriveResource = {
      id: Date.now().toString(),
      nombre: autoName,
      tipo: currentResource.tipo,
      link: currentResource.link
    }
    setResources([...resources, newResource])
    setCurrentResource({ nombre: "", tipo: "", link: "" })
    toast.success("Recurso agregado correctamente")
  }

  // Validación de URL (igual que antes)
  const validateGoogleDriveUrl = async (url: string, tipo: string): Promise<{ valid: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/drive/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, tipo }),
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
    setResources(resources.filter(resource => resource.id !== id))
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
            Agrega links de archivos de Google Drive para tu artículo. Solo se permiten archivos de tipo Imagen, Video y PDF.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información de tipos permitidos */}
          <div className="space-y-2">
            <Label>Formatos de archivos permitidos:</Label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong className="text-blue-600">Imágenes:</strong>
                  <p className="text-gray-600">JPG, JPEG, PNG, GIF, BMP, WEBP</p>
                </div>
                <div>
                  <strong className="text-red-600">Videos:</strong>
                  <p className="text-gray-600">MP4, AVI, MOV, WMV, FLV, WEBM</p>
                </div>
                <div>
                  <strong className="text-orange-600">Documentos:</strong>
                  <p className="text-gray-600">PDF</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botón para abrir Google Picker */}
          <div className="flex justify-center">
            <Button type="button" variant="secondary" onClick={handleOpenPicker}>
              <FolderOpen className="mr-2 h-4 w-4" />
              Seleccionar desde Google Drive
            </Button>
          </div>

          {/* Formulario para agregar recurso manualmente */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de archivo:</Label>
              <select
                id="tipo"
                className="w-full p-2 border rounded-md"
                value={currentResource.tipo}
                onChange={(e) => setCurrentResource({ ...currentResource, tipo: e.target.value })}
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
              <Label htmlFor="link">Link de Google Drive:</Label>
              <Input
                id="link"
                placeholder="https://drive.google.com/file/d/..."
                value={currentResource.link}
                onChange={(e) => setCurrentResource({ ...currentResource, link: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                Ejemplos de URLs válidas:
                <br />• https://drive.google.com/file/d/[ID]/view?usp=sharing
                <br />• https://docs.google.com/document/d/[ID]/edit
                <br />• https://docs.google.com/spreadsheets/d/[ID]/edit
              </p>
            </div>

            <Button onClick={handleAddResource} className="w-full">
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
                  <div key={resource.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{resource.nombre}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeResource(resource.id)}>
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
              <p className="text-xs">Haz clic en "Agregar Recursos de Google Drive" o "Seleccionar desde Google Drive" para comenzar</p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleAccept} className="flex-1">
              Aceptar
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 