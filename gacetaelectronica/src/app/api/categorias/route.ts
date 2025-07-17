import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';

// ✅ GET: Obtener todas las categorías o una por ID
export async function GET(req: NextRequest) {
  try {
    const pool = await getConnection();
    const id = req.nextUrl.searchParams.get('id');

    if (id) {
      if (isNaN(Number(id))) {
        return new Response('ID inválido', { status: 400 });
      }

      const [rows] = await pool.query('SELECT * FROM Categorias WHERE IdCategoria = ?', [id]) as [any[], any];
      if (rows.length === 0) {
        return new Response('Categoría no encontrada', { status: 404 });
      }
      return Response.json(rows[0]);
    } else {
      const [rows] = await pool.query('SELECT * FROM Categorias') as [any[], any];
      return Response.json(rows);
    }
  } catch (err) {
    console.error('Error en GET categorias:', err);
    return new Response('Error al obtener categorías', { status: 500 });
  }
}

// ✅ POST: Crear nueva categoría
export async function POST(req: NextRequest) {
  try {
    const { nombre } = await req.json();

    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      return new Response('El nombre es requerido y debe ser un texto válido', { status: 400 });
    }

    const pool = await getConnection();

    const [exists] = await pool.query('SELECT * FROM Categorias WHERE Nombre = ?', [nombre.trim()]) as [any[], any];
    if (exists.length > 0) {
      return new Response('Ya existe una categoría con ese nombre', { status: 409 });
    }

    const [result] = await pool.query(
      'INSERT INTO Categorias (Nombre) VALUES (?)',
      [nombre.trim()]
    );

    return Response.json({
      message: 'Categoría creada',
      id: (result as any).insertId,
    });
  } catch (err) {
    console.error('Error en POST categorias:', err);
    return new Response('Error al crear categoría', { status: 500 });
  }
}

// ✅ PUT: Actualizar categoría por ID
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

    const [exists] = await pool.query('SELECT * FROM Categorias WHERE IdCategoria = ?', [id]) as [any[], any];
    if (exists.length === 0) {
      return new Response('Categoría no encontrada', { status: 404 });
    }

    const [duplicate] = await pool.query(
      'SELECT * FROM Categorias WHERE Nombre = ? AND IdCategoria != ?',
      [nombre.trim(), id]
    ) as [any[], any];
    if (duplicate.length > 0) {
      return new Response('Ya existe otra categoría con ese nombre', { status: 409 });
    }

    await pool.query(
      'UPDATE Categorias SET Nombre = ? WHERE IdCategoria = ?',
      [nombre.trim(), id]
    );

    return Response.json({ message: 'Categoría actualizada' });
  } catch (err) {
    console.error('Error en PUT categorias:', err);
    return new Response('Error al actualizar categoría', { status: 500 });
  }
}

// ✅ DELETE: Eliminar categoría por ID
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');

    if (!id || isNaN(Number(id))) {
      return new Response('ID válido requerido', { status: 400 });
    }

    const pool = await getConnection();

    const [exists] = await pool.query('SELECT * FROM Categorias WHERE IdCategoria = ?', [id]) as [any[], any];
    if (exists.length === 0) {
      return new Response('Categoría no encontrada', { status: 404 });
    }

    await pool.query('DELETE FROM Categorias WHERE IdCategoria = ?', [id]);

    return Response.json({ message: 'Categoría eliminada' });
  } catch (err) {
    console.error('Error en DELETE categorias:', err);
    return new Response('Error al eliminar categoría', { status: 500 });
  }
}
