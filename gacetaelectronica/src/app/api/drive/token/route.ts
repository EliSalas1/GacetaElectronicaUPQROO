import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Código de autorización requerido' },
        { status: 400 }
      )
    }

    // Intercambiar el código por tokens
    const { tokens } = await oauth2Client.getToken(code)
    
    if (!tokens.access_token) {
      return NextResponse.json(
        { error: 'No se pudo obtener el token de acceso' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expiry_date
    })

  } catch (error) {
    console.error('Error obteniendo token:', error)
    return NextResponse.json(
      { error: 'Error al obtener el token de acceso' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Generar URL de autorización
    const scopes = [
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/drive.metadata.readonly'
    ]

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    })

    return NextResponse.json({ authUrl })

  } catch (error) {
    console.error('Error generando URL de autorización:', error)
    return NextResponse.json(
      { error: 'Error al generar URL de autorización' },
      { status: 500 }
    )
  }
} 