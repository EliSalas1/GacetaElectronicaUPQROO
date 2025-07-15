import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';

// ✅ GET: Obtener todos los logros o uno por ID
export async function GET(req: NextRequest) {
  try {
    const pool = await getConnection();
    const id = req.nextUrl.searchParams.get('id');

    if (id) {
      const [rows] = await pool.query('SELECT * FROM Logros WHERE IdLogro = ?', [id]) as [any[], any];
      if (rows.length === 0) {
        return new Response('Logro no encontrado', { status: 404 });
      }
      return Response.json(rows[0]);
    } else {
      const [rows] = await pool.query('SELECT * FROM Logros') as [any[], any];
      return Response.json(rows);
    }
  } catch (err) {
    console.error('Error en GET logros:', err);
    return new Response('Error al obtener logros', { status: 500 });
  }
}

// ✅ POST: Crear un nuevo logro
export async function POST(req: NextRequest) {
  try {
    const { titulo, descripcion } = await req.json();

    if (!titulo || !descripcion) {
      return new Response('Título y descripción son requeridos', { status: 400 });
    }

    const pool = await getConnection();
    const [result] = await pool.query(
      'INSERT INTO Logros (Titulo, Descripcion) VALUES (?, ?)',
      [titulo.trim(), descripcion.trim()]
    );

    return Response.json({
      message: 'Logro creado',
      id: (result as any).insertId,
    });
  } catch (err) {
    console.error('Error en POST logros:', err);
    return new Response('Error al crear logro', { status: 500 });
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

    const pool = await getConnection();
    const [exists] = await pool.query('SELECT * FROM Logros WHERE IdLogro = ?', [id]) as [any[], any];
    if (exists.length === 0) {
      return new Response('Logro no encontrado', { status: 404 });
    }

    await pool.query(
      'UPDATE Logros SET Titulo = ?, Descripcion = ? WHERE IdLogro = ?',
      [titulo.trim(), descripcion.trim(), id]
    );

    return Response.json({ message: 'Logro actualizado' });
  } catch (err) {
    console.error('Error en PUT logros:', err);
    return new Response('Error al actualizar logro', { status: 500 });
  }
}

// ✅ DELETE: Eliminar un logro por ID
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');

    if (!id || isNaN(Number(id))) {
      return new Response('ID válido requerido', { status: 400 });
    }

    const pool = await getConnection();
    const [exists] = await pool.query('SELECT * FROM Logros WHERE IdLogro = ?', [id]) as [any[], any];
    if (exists.length === 0) {
      return new Response('Logro no encontrado', { status: 404 });
    }

    await pool.query('DELETE FROM Logros WHERE IdLogro = ?', [id]);

    return Response.json({ message: 'Logro eliminado' });
  } catch (err) {
    console.error('Error en DELETE logros:', err);
    return new Response('Error al eliminar logro', { status: 500 });
  }
}
