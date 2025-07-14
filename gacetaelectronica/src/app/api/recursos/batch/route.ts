import { NextRequest } from 'next/server'
import getConnection from '@/lib/db'

// POST: Crear múltiples recursos de Google Drive
export async function POST(req: NextRequest) {
  try {
    const { recursos, articuloId } = await req.json()

    if (!recursos || !Array.isArray(recursos) || recursos.length === 0) {
      return new Response('Se requiere un array de recursos', { status: 400 })
    }

    if (!articuloId) {
      return new Response('articuloId es requerido', { status: 400 })
    }

    const pool = await getConnection()

    // Verifica si el artículo existe
    const [articulo] = await pool.query('SELECT * FROM Articulos WHERE idArticulo = ?', [articuloId]) as [any[], any]
    if (articulo.length === 0) {
      return new Response('El artículo relacionado no existe', { status: 404 })
    }

    const results = []
    const errors = []

    // Procesar cada recurso
    for (const recurso of recursos) {
      try {
        const { nombre, link, tipo } = recurso

        if (!nombre || !link || !tipo) {
          errors.push(`Recurso inválido: faltan campos requeridos`)
          continue
        }

        // Verifica si el recurso con el mismo nombre ya existe
        const [exists] = await pool.query('SELECT * FROM Recursos WHERE Nombre = ?', [nombre]) as [any[], any]
        if (exists.length > 0) {
          errors.push(`Ya existe un recurso con el nombre: ${nombre}`)
          continue
        }

        // Inserta el nuevo recurso
        const [result] = await pool.query(
          'INSERT INTO Recursos (Nombre, Ruta, Tipo, Articulos_idArticulo) VALUES (?, ?, ?, ?)',
          [nombre, link, tipo, articuloId]
        )

        results.push({
          id: (result as any).insertId,
          nombre,
          link,
          tipo
        })

      } catch (error) {
        console.error('Error inserting resource:', error)
        errors.push(`Error al insertar recurso: ${recurso.nombre}`)
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Recursos procesados', 
        created: results,
        errors: errors.length > 0 ? errors : undefined
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('Error en POST recursos batch:', err)
    return new Response('Error al crear recursos', { status: 500 })
  }
} 