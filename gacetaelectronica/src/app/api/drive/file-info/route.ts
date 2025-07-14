import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

// Configurar el cliente de Google Drive
const drive = google.drive({
  version: 'v3',
  headers: {
    Authorization: `Bearer ${process.env.GOOGLE_ACCESS_TOKEN}`,
  },
})

// Función para extraer el ID del archivo de diferentes formatos de URL
const extractFileId = (url: string): string | null => {
  // Patrón para URLs de archivos de Google Drive
  const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (fileIdMatch) {
    return fileIdMatch[1]
  }
  
  // Patrón para URLs con parámetro id
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (idMatch) {
    return idMatch[1]
  }
  
  return null
}

export async function POST(req: NextRequest) {
  try {
    const { url, tipo } = await req.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL es requerida' },
        { status: 400 }
      )
    }

    const fileId = extractFileId(url)
    if (!fileId) {
      return NextResponse.json(
        { error: 'No se pudo extraer el ID del archivo de la URL' },
        { status: 400 }
      )
    }

    try {
      // Obtener información del archivo usando la API de Google Drive
      const response = await drive.files.get({
        fileId: fileId,
        fields: 'id,name,mimeType,thumbnailLink,webContentLink,webViewLink,size'
      })

      const file = response.data

      // Verificar que el tipo de archivo coincida con el tipo esperado
      const mimeType = file.mimeType || ''
      let isValidType = false

      switch (tipo) {
        case 'imagen':
          isValidType = mimeType.startsWith('image/')
          break
        case 'video':
          isValidType = mimeType.startsWith('video/')
          break
        case 'pdf':
          isValidType = mimeType === 'application/pdf'
          break
        default:
          isValidType = true
      }

      if (!isValidType) {
        return NextResponse.json(
          { 
            error: `El tipo de archivo (${mimeType}) no coincide con el tipo esperado (${tipo})` 
          },
          { status: 400 }
        )
      }

      // Generar URLs de vista previa
      const previewUrls = {
        thumbnail: file.thumbnailLink || null,
        direct: file.webContentLink || null,
        view: file.webViewLink || null,
        name: file.name || 'Archivo sin nombre',
        size: file.size || '0',
        mimeType: file.mimeType || ''
      }

      return NextResponse.json({
        success: true,
        fileId: file.id,
        previewUrls,
        metadata: {
          name: file.name,
          size: file.size,
          mimeType: file.mimeType
        }
      })

    } catch (error: any) {
      console.error('Error al obtener información del archivo:', error)
      
      // Si no hay token de acceso, usar método alternativo
      if (error.code === 401 || !process.env.GOOGLE_ACCESS_TOKEN) {
        return NextResponse.json({
          success: true,
          fileId,
          previewUrls: {
            thumbnail: `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h300`,
            direct: `https://drive.google.com/uc?export=view&id=${fileId}`,
            view: `https://drive.google.com/file/d/${fileId}/view`,
            name: 'Archivo de Google Drive',
            size: '0',
            mimeType: ''
          },
          metadata: {
            name: 'Archivo de Google Drive',
            size: '0',
            mimeType: ''
          },
          note: 'Usando URLs públicas (sin autenticación)'
        })
      }

      return NextResponse.json(
        { error: 'Error al obtener información del archivo de Google Drive' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error en file-info:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 