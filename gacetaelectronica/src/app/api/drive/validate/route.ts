import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { url, tipo } = await req.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL es requerida' },
        { status: 400 }
      )
    }

    // Patrones válidos para URLs de Google Drive (más flexibles)
    const validPatterns = [
      /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\/view(\?.*)?$/,
      /^https:\/\/drive\.google\.com\/open\?id=[a-zA-Z0-9_-]+(&.*)?$/,
      /^https:\/\/docs\.google\.com\/document\/d\/[a-zA-Z0-9_-]+\/edit(\?.*)?$/,
      /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9_-]+\/edit(\?.*)?$/,
      /^https:\/\/docs\.google\.com\/presentation\/d\/[a-zA-Z0-9_-]+\/edit(\?.*)?$/,
      /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+$/,
      /^https:\/\/drive\.google\.com\/uc\?id=[a-zA-Z0-9_-]+(&.*)?$/
    ]

    const isValidUrl = validPatterns.some(pattern => pattern.test(url))

    if (!isValidUrl) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'La URL no es una URL válida de Google Drive' 
        },
        { status: 400 }
      )
    }

    // Validación básica del tipo de archivo
    const validTypes = ['imagen', 'video', 'pdf']
    if (tipo && !validTypes.includes(tipo)) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Tipo de archivo no válido. Solo se permiten: imagen, video, pdf' 
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      valid: true,
      message: 'URL válida de Google Drive',
      url,
      tipo
    })

  } catch (error) {
    console.error('Error validating Google Drive URL:', error)
    return NextResponse.json(
      { error: 'Error al validar la URL' },
      { status: 500 }
    )
  }
} 