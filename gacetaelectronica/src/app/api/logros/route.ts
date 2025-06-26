import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';

// ✅ GET: Obtener todos los logros o uno por ID
export async function GET(req: NextRequest) {
  try {
    const conn = await getConnection();
    const id = req.nextUrl.searchParams.get('id');

    if (id) {
      const [rows] = await conn
        .promise()
        .query('SELECT * FROM logros WHERE IdLogro = ?', [id]) as [any[], any];

      if (rows.length === 0) {
        return new Response('Logro no encontrado', { status: 404 });
      }

      return Response.json(rows[0]);
    } else {
      const [rows] = await conn.promise().query('SELECT * FROM logros');
      return Response.json(rows);
    }
  } catch (err) {
    console.error(err);
    return new Response('Error en la base de datos', { status: 500 });
  }
}

// ✅ POST: Crear un nuevo logro
export async function POST(req: NextRequest) {
  try {
    const { titulo, descripcion } = await req.json();

    if (!titulo || !descripcion) {
      return new Response('Título y descripción son requeridos', { status: 400 });
    }

    const conn = await getConnection();
    const [result] = await conn
      .promise()
      .query('INSERT INTO logros (Titulo, Descripcion) VALUES (?, ?)', [titulo, descripcion]);

    return Response.json({
      message: 'Logro creado',
      id: (result as any).insertId,
    });
  } catch (err) {
    console.error(err);
    return new Response('Error al insertar el logro', { status: 500 });
  }
}

// ✅ PUT: Actualizar un logro por ID
export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    const { titulo, descripcion } = await req.json();

    if (!id || !titulo || !descripcion) {
      return new Response('ID, título y descripción son requeridos', { status: 400 });
    }

    const conn = await getConnection();
    await conn
      .promise()
      .query('UPDATE logros SET Titulo = ?, Descripcion = ? WHERE IdLogro = ?', [titulo, descripcion, id]);

    return Response.json({ message: 'Logro actualizado' });
  } catch (err) {
    console.error(err);
    return new Response('Error al actualizar el logro', { status: 500 });
  }
}

// ✅ DELETE: Eliminar un logro por ID
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');

    if (!id) {
      return new Response('ID es requerido', { status: 400 });
    }

    const conn = await getConnection();
    await conn.promise().query('DELETE FROM logros WHERE IdLogro = ?', [id]);

    return Response.json({ message: 'Logro eliminado' });
  } catch (err) {
    console.error(err);
    return new Response('Error al eliminar el logro', { status: 500 });
  }
}
