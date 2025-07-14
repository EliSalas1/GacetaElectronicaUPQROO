import { NextRequest, NextResponse } from 'next/server'

// Configuración base para Google OAuth (sin googleapis por ahora)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/drive/callback'

export async function GET(req: NextRequest) {
  try {
    if (!GOOGLE_CLIENT_ID) {
      return NextResponse.json(
        { error: 'GOOGLE_CLIENT_ID no está configurado' },
        { status: 500 }
      )
    }

    const scopes = [
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/drive.metadata.readonly'
    ]

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `scope=${encodeURIComponent(scopes.join(' '))}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=consent`

    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error('Error generating auth URL:', error)
    return NextResponse.json(
      { error: 'Error generating authentication URL' },
      { status: 500 }
    )
  }
} 