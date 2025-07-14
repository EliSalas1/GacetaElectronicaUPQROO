"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Play, FileText, Image, Video, File } from "lucide-react"

interface ResourcePreviewProps {
  resource: {
    id: string
    nombre: string
    tipo: string
    link: string
  }
  onRemove: (id: string) => void
}

export default function ResourcePreview({ resource, onRemove }: ResourcePreviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fileInfo, setFileInfo] = useState<any>(null)

  // Función para obtener el icono según el tipo
  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'imagen':
        return <Image className="w-8 h-8 text-blue-500" />
      case 'video':
        return <Video className="w-8 h-8 text-red-500" />
      case 'pdf':
        return <FileText className="w-8 h-8 text-orange-500" />
      default:
        return <File className="w-8 h-8 text-gray-500" />
    }
  }

  // Función para generar la URL de vista previa de Google Drive
  const getPreviewUrl = (link: string, tipo: string) => {
    // Extraer el ID del archivo de diferentes formatos de URL de Google Drive
    let fileId = null
    
    // Patrón para URLs de archivos de Google Drive
    const fileIdMatch = link.match(/\/d\/([a-zA-Z0-9_-]+)/)
    if (fileIdMatch) {
      fileId = fileIdMatch[1]
    } else {
      // Patrón para URLs con parámetro id
      const idMatch = link.match(/[?&]id=([a-zA-Z0-9_-]+)/)
      if (idMatch) {
        fileId = idMatch[1]
      }
    }

    if (!fileId) return null

    switch (tipo) {
      case 'imagen':
        // Para imágenes, usar múltiples formatos de URL
        return {
          direct: `https://drive.google.com/uc?export=view&id=${fileId}`,
          download: `https://drive.google.com/uc?export=download&id=${fileId}`,
          thumbnail: `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h300`
        }
      case 'video':
        // Para videos, usar múltiples formatos de URL
        return {
          direct: `https://drive.google.com/uc?export=view&id=${fileId}`,
          download: `https://drive.google.com/uc?export=download&id=${fileId}`,
          thumbnail: `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h300`
        }
      case 'pdf':
        // Para PDFs, usar la URL de vista previa de Google Docs
        return {
          viewer: `https://docs.google.com/viewer?url=https://drive.google.com/uc?export=download&id=${fileId}&embedded=true`,
          download: `https://drive.google.com/uc?export=download&id=${fileId}`
        }
      default:
        return null
    }
  }

  const previewUrls = getPreviewUrl(resource.link, resource.tipo)

  // Función para obtener la URL de imagen de manera segura
  const getImageUrl = () => {
    if (!previewUrls || resource.tipo !== 'imagen') return ''
    return previewUrls.thumbnail || previewUrls.direct || ''
  }

  // Función para obtener la URL de video de manera segura
  const getVideoUrl = () => {
    if (!previewUrls || resource.tipo !== 'video') return ''
    return previewUrls.direct || ''
  }

  // Efecto para obtener información del archivo
  useEffect(() => {
    const getFileInfo = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/drive/file-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: resource.link,
            tipo: resource.tipo
          }),
        })

        const data = await response.json()

        if (data.success) {
          setFileInfo(data)
          setIsLoading(false)
        } else {
          setError(data.error || 'Error al obtener información del archivo')
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error obteniendo información del archivo:', error)
        setError('Error de conexión')
        setIsLoading(false)
      }
    }

    if (resource.link && resource.tipo) {
      getFileInfo()
    }
  }, [resource.link, resource.tipo])

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header del recurso */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          {getIcon(resource.tipo)}
                      <div>
              <h4 className="font-medium text-sm text-gray-900 truncate max-w-[200px]">
                {fileInfo?.metadata?.name || resource.nombre}
              </h4>
              <p className="text-xs text-gray-500 capitalize">
                {resource.tipo}
                {fileInfo?.metadata?.size && (
                  <span className="ml-1">• {Math.round(parseInt(fileInfo.metadata.size) / 1024)}KB</span>
                )}
              </p>
            </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(resource.id)}
          className="text-gray-400 hover:text-red-500"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Contenido de vista previa */}
      <div className="p-4">
        <div className="w-full h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-sm text-gray-500">Cargando vista previa...</p>
            </div>
          ) : error ? (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
              <div className="text-center">
                {resource.tipo === 'imagen' ? (
                  <Image className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                ) : resource.tipo === 'video' ? (
                  <Video className="w-12 h-12 text-red-500 mx-auto mb-2" />
                ) : (
                  <FileText className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                )}
                <p className="text-sm text-gray-600 text-center mb-2">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(resource.link, '_blank')}
                  className="text-xs"
                >
                  Ver en Google Drive
                </Button>
              </div>
            </div>
          ) : fileInfo && resource.tipo === 'imagen' && fileInfo.previewUrls.thumbnail ? (
            <div className="relative w-full h-full">
              <img
                src={fileInfo.previewUrls.thumbnail}
                alt={fileInfo.metadata.name || resource.nombre}
                className="w-full h-full object-cover rounded-lg"
                onError={() => {
                  setError('No se pudo cargar la imagen')
                }}
              />
            </div>
          ) : fileInfo && resource.tipo === 'video' && fileInfo.previewUrls.direct ? (
            <div className="relative w-full h-full">
              <video
                src={fileInfo.previewUrls.direct}
                className="w-full h-full object-cover rounded-lg"
                controls
                preload="metadata"
                onError={() => {
                  setError('No se pudo cargar la vista previa del video')
                }}
              />
            </div>
          ) : resource.tipo === 'pdf' ? (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
              <FileText className="w-12 h-12 text-orange-500" />
              <p className="text-sm text-gray-600 text-center">Vista previa de PDF</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(resource.link, '_blank')}
                className="text-xs"
              >
                Abrir PDF
              </Button>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
              <div className="text-center">
                {resource.tipo === 'imagen' ? (
                  <Image className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                ) : resource.tipo === 'video' ? (
                  <Video className="w-12 h-12 text-red-500 mx-auto mb-2" />
                ) : (
                  <FileText className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                )}
                <p className="text-sm text-gray-600 text-center mb-2">Vista previa no disponible</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(resource.link, '_blank')}
                  className="text-xs"
                >
                  Ver en Google Drive
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
            {error}
          </div>
        )}

        {/* Link del recurso */}
        <div className="mt-3">
          <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 truncate block"
            title={resource.link}
          >
            Ver en Google Drive
          </a>
        </div>
      </div>
    </div>
  )
} 