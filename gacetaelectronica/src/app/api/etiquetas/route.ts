import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';

// ✅ GET: Obtener todas o una etiqueta por ID
export async function GET(req: NextRequest) {
  try {
    const pool = await getConnection();
    const id = req.nextUrl.searchParams.get('id');

    if (id) {
      const [rows] = await pool.query('SELECT * FROM Etiquetas WHERE IdEtiqueta = ?', [id]) as [any[], any];
      if (rows.length === 0) {
        return new Response('Etiqueta no encontrada', { status: 404 });
      }
      return Response.json(rows[0]);
    } else {
      const [rows] = await pool.query('SELECT * FROM Etiquetas') as [any[], any];
      return Response.json(rows);
    }
  } catch (err) {
    console.error('Error en GET etiquetas:', err);
    return new Response('Error al obtener etiquetas', { status: 500 });
  }
}

// ✅ POST: Crear nueva etiqueta
export async function POST(req: NextRequest) {
  try {
    const { nombre } = await req.json();
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      return new Response('El nombre es requerido y debe ser un texto válido', { status: 400 });
    }

    const pool = await getConnection();
    const [exists] = await pool.query('SELECT * FROM Etiquetas WHERE Nombre = ?', [nombre.trim()]) as [any[], any];
    if (exists.length > 0) {
      return new Response('Ya existe una etiqueta con ese nombre', { status: 409 });
    }

    const [result] = await pool.query(
      'INSERT INTO Etiquetas (Nombre) VALUES (?)',
      [nombre.trim()]
    );

    return Response.json({
      message: 'Etiqueta creada',
      id: (result as any).insertId,
    });
  } catch (err) {
    console.error('Error en POST etiquetas:', err);
    return new Response('Error al crear etiqueta', { status: 500 });
  }
}

// ✅ PUT: Actualizar etiqueta por ID
export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    const { nombre } = await req.json();

    if (!id || isNaN(Number(id))) {
      return new Response('ID válido requerido', { status: 400 });
    }

    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      return new Response('El nombre es requerido y debe ser un texto válido', { status: 400 });
    }

    const pool = await getConnection();
    const [exists] = await pool.query('SELECT * FROM Etiquetas WHERE IdEtiqueta = ?', [id]) as [any[], any];
    if (exists.length === 0) {
      return new Response('Etiqueta no encontrada', { status: 404 });
    }

    const [duplicate] = await pool.query(
      'SELECT * FROM Etiquetas WHERE Nombre = ? AND IdEtiqueta != ?',
      [nombre.trim(), id]
    ) as [any[], any];
    if (duplicate.length > 0) {
      return new Response('Ya existe otra etiqueta con ese nombre', { status: 409 });
    }

    await pool.query(
      'UPDATE Etiquetas SET Nombre = ? WHERE IdEtiqueta = ?',
      [nombre.trim(), id]
    );

    return Response.json({ message: 'Etiqueta actualizada' });
  } catch (err) {
    console.error('Error en PUT etiquetas:', err);
    return new Response('Error al actualizar etiqueta', { status: 500 });
  }
}

// ✅ DELETE: Eliminar etiqueta por ID
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');

    if (!id || isNaN(Number(id))) {
      return new Response('ID válido requerido', { status: 400 });
    }

    const pool = await getConnection();
    const [exists] = await pool.query('SELECT * FROM Etiquetas WHERE IdEtiqueta = ?', [id]) as [any[], any];
    if (exists.length === 0) {
      return new Response('Etiqueta no encontrada', { status: 404 });
    }

    await pool.query('DELETE FROM Etiquetas WHERE IdEtiqueta = ?', [id]);

    return Response.json({ message: 'Etiqueta eliminada' });
  } catch (err) {
    console.error('Error en DELETE etiquetas:', err);
    return new Response('Error al eliminar etiqueta', { status: 500 });
  }
}
