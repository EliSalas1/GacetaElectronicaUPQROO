"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"


export default function TestPreview() {
  const [url, setUrl] = useState("")
  const [tipo, setTipo] = useState("imagen")
  const [previewUrl, setPreviewUrl] = useState("")

  const getPreviewUrl = (link: string, tipo: string) => {
    let fileId = null
    
    const fileIdMatch = link.match(/\/d\/([a-zA-Z0-9_-]+)/)
    if (fileIdMatch) {
      fileId = fileIdMatch[1]
    } else {
      const idMatch = link.match(/[?&]id=([a-zA-Z0-9_-]+)/)
      if (idMatch) {
        fileId = idMatch[1]
      }
    }

    if (!fileId) return null

    switch (tipo) {
      case 'imagen':
        return {
          thumbnail: `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h300`,
          direct: `https://drive.google.com/uc?export=view&id=${fileId}`,
          download: `https://drive.google.com/uc?export=download&id=${fileId}`
        }
      case 'video':
        return {
          direct: `https://drive.google.com/uc?export=view&id=${fileId}`,
          download: `https://drive.google.com/uc?export=download&id=${fileId}`,
          thumbnail: `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h300`
        }
      default:
        return null
    }
  }

  const handleTest = () => {
    const urls = getPreviewUrl(url, tipo)
    if (urls) {
      setPreviewUrl(urls.thumbnail || urls.direct)
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Prueba de Vista Previa</h3>
      
      <div className="space-y-4">
        <div>
          <Label>Tipo:</Label>
          <select 
            value={tipo} 
            onChange={(e) => setTipo(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="imagen">Imagen</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div>
          <Label>URL de Google Drive:</Label>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://drive.google.com/file/d/..."
          />
        </div>

        <Button onClick={handleTest}>Probar Vista Previa</Button>

        {previewUrl && (
          <div className="mt-4">
            <Label>Vista Previa:</Label>
            <div className="relative w-full h-48 bg-gray-100 rounded border">
              {tipo === 'imagen' ? (
                <Image 
                  src={previewUrl}
                  alt="Vista previa de imagen"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded"
                  onError={() => {
                  console.error('Error loading image')
                  }}
                />

              ) : (
                <video 
                  src={previewUrl} 
                  controls 
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    console.error('Error loading video:', e)
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 