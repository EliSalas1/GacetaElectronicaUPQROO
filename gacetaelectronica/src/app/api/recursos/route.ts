import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const pool = await getConnection();
    const id = req.nextUrl.searchParams.get('id');

    if (id) {
      const [rows] = await pool.query('SELECT * FROM recursos WHERE IdRecurso = ?', [id]) as [any[], any];
      if (rows.length === 0) {
        return new Response('Recurso no encontrado', { status: 404 });
      }
      return Response.json(rows[0]);
    } else {
      const [rows] = await pool.query('SELECT * FROM recursos');
      return Response.json(rows);
    }
  } catch (err) {
    console.error('Error en GET recursos:', err);
    return new Response('Error al obtener recursos', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nombre, ruta, articuloId } = await req.json();

    if (!nombre || !ruta || !articuloId) {
      return new Response('Todos los campos (nombre, ruta, articuloId) son requeridos', { status: 400 });
    }

    const pool = await getConnection();

    const [articulo] = await pool.query('SELECT * FROM articulos WHERE idArticulo = ?', [articuloId]) as [any[], any];
    if (articulo.length === 0) {
      return new Response('El artículo relacionado no existe', { status: 404 });
    }

    const [exists] = await pool.query('SELECT * FROM recursos WHERE Nombre = ?', [nombre]) as [any[], any];
    if (exists.length > 0) {
      return new Response('Ya existe un recurso con ese nombre', { status: 409 });
    }

    const [result] = await pool.query(
      `INSERT INTO recursos (Nombre, Ruta, Articulos_idArticulo)
       VALUES (?, ?, ?)`,
      [nombre, ruta, articuloId]
    );

    return Response.json({
      message: 'Recurso creado correctamente',
      id: (result as any).insertId,
    });
  } catch (err) {
    console.error('Error en POST recursos:', err);
    return new Response('Error al crear recurso', { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    const { nombre, ruta, articuloId } = await req.json();

    if (!id || !nombre || !ruta || !articuloId) {
      return new Response('Todos los campos (id, nombre, ruta, articuloId) son requeridos', { status: 400 });
    }

    const pool = await getConnection();

    const [recurso] = await pool.query('SELECT * FROM recursos WHERE IdRecurso = ?', [id]) as [any[], any];
    if (recurso.length === 0) {
      return new Response('Recurso no encontrado', { status: 404 });
    }

    const [articulo] = await pool.query('SELECT * FROM articulos WHERE idArticulo = ?', [articuloId]) as [any[], any];
    if (articulo.length === 0) {
      return new Response('El artículo relacionado no existe', { status: 404 });
    }

    const [duplicate] = await pool.query(
      'SELECT * FROM recursos WHERE Nombre = ? AND IdRecurso != ?',
      [nombre, id]
    ) as [any[], any];
    if (duplicate.length > 0) {
      return new Response('Ya existe otro recurso con ese nombre', { status: 409 });
    }

    await pool.query(
      `UPDATE recursos
       SET Nombre = ?, Ruta = ?, Articulos_idArticulo = ?
       WHERE IdRecurso = ?`,
      [nombre, ruta, articuloId, id]
    );

    return Response.json({ message: 'Recurso actualizado correctamente' });
  } catch (err) {
    console.error('Error en PUT recursos:', err);
    return new Response('Error al actualizar recurso', { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return new Response('ID es requerido para eliminar recurso', { status: 400 });
    }

    const pool = await getConnection();

    const [recurso] = await pool.query('SELECT * FROM recursos WHERE IdRecurso = ?', [id]) as [any[], any];
    if (recurso.length === 0) {
      return new Response('Recurso no encontrado', { status: 404 });
    }

    await pool.query('DELETE FROM recursos WHERE IdRecurso = ?', [id]);

    return Response.json({ message: 'Recurso eliminado correctamente' });
  } catch (err) {
    console.error('Error en DELETE recursos:', err);
    return new Response('Error al eliminar recurso', { status: 500 });
  }
}
