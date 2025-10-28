import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';

// ✅ GET: Obtener todos los recursos o uno por ID
export async function GET(req: NextRequest) {
  try {
    const pool = await getConnection();
    const id = req.nextUrl.searchParams.get('id');
    const articuloId = req.nextUrl.searchParams.get('articuloId');

    if (id) {
      if (isNaN(Number(id))) {
        return new Response('ID inválido', { status: 400 });
      }

      const [rows] = await pool.query('SELECT * FROM Recursos WHERE IdRecurso = ?', [id]) as [any[], any];
      if (rows.length === 0) {
        return new Response('Recurso no encontrado', { status: 404 });
      }
      return new Response(JSON.stringify(rows[0]), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else if (articuloId) {
      if (isNaN(Number(articuloId))) {
        return new Response('ID de artículo inválido', { status: 400 });
      }

      const [rows] = await pool.query('SELECT * FROM Recursos WHERE Articulos_idArticulo = ?', [articuloId]) as [any[], any];
      return new Response(JSON.stringify(rows), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else {
      const [rows] = await pool.query('SELECT * FROM Recursos') as [any[], any];
      return new Response(JSON.stringify(rows), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
  } catch (err) {
    console.error('Error en GET recursos:', err);
    return new Response('Error al obtener recursos', { status: 500 });
  }
}

// ✅ POST: Crear nuevo recurso
export async function POST(req: NextRequest) {
  try {
    const { nombre, ruta, articuloId } = await req.json();

    if (!nombre || !ruta || !articuloId) {
      return new Response('Todos los campos (nombre, ruta, articuloId) son requeridos', { status: 400 });
    }

    const pool = await getConnection();

    // Verifica si el artículo existe
    const [articulo] = await pool.query('SELECT * FROM Articulos WHERE idArticulo = ?', [articuloId]) as [any[], any];
    if (articulo.length === 0) {
      return new Response('El artículo relacionado no existe', { status: 404 });
    }

    // Verifica si el recurso con el mismo nombre ya existe
    const [exists] = await pool.query('SELECT * FROM Recursos WHERE Nombre = ?', [nombre]) as [any[], any];
    if (exists.length > 0) {
      return new Response('Ya existe un recurso con ese nombre', { status: 409 });
    }

    // Inserta el nuevo recurso
    const [result] = await pool.query(
      'INSERT INTO Recursos (Nombre, Ruta, Articulos_idArticulo) VALUES (?, ?, ?)',
      [nombre, ruta, articuloId]
    );

    return new Response(
      JSON.stringify({ message: 'Recurso creado correctamente', id: (result as any).insertId }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error en POST recursos:', err);
    return new Response('Error al crear recurso', { status: 500 });
  }
}

// ✅ PUT: Actualizar recurso por ID
export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    const { nombre, ruta, articuloId } = await req.json();

    if (!id || isNaN(Number(id))) {
      return new Response('ID válido requerido', { status: 400 });
    }

    if (!nombre || !ruta || !articuloId) {
      return new Response('Todos los campos (nombre, ruta, articuloId) son requeridos', { status: 400 });
    }

    const pool = await getConnection();

    // Verifica si el recurso existe
    const [recurso] = await pool.query('SELECT * FROM Recursos WHERE IdRecurso = ?', [id]) as [any[], any];
    if (recurso.length === 0) {
      return new Response('Recurso no encontrado', { status: 404 });
    }

    // Verifica si el artículo existe
    const [articulo] = await pool.query('SELECT * FROM Articulos WHERE idArticulo = ?', [articuloId]) as [any[], any];
    if (articulo.length === 0) {
      return new Response('El artículo relacionado no existe', { status: 404 });
    }

    // Verifica si ya existe otro recurso con el mismo nombre
    const [duplicate] = await pool.query(
      'SELECT * FROM Recursos WHERE Nombre = ? AND IdRecurso != ?',
      [nombre, id]
    ) as [any[], any];
    if (duplicate.length > 0) {
      return new Response('Ya existe otro recurso con ese nombre', { status: 409 });
    }

    // Actualiza el recurso
    await pool.query(
      'UPDATE Recursos SET Nombre = ?, Ruta = ?, Articulos_idArticulo = ? WHERE IdRecurso = ?',
      [nombre, ruta, articuloId, id]
    );

    return new Response(JSON.stringify({ message: 'Recurso actualizado correctamente' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Error en PUT recursos:', err);
    return new Response('Error al actualizar recurso', { status: 500 });
  }
}

// ✅ DELETE: Eliminar recurso por ID
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id || isNaN(Number(id))) {
      return new Response('ID es requerido para eliminar recurso', { status: 400 });
    }

    const pool = await getConnection();

    // Verifica si el recurso existe
    const [recurso] = await pool.query('SELECT * FROM Recursos WHERE IdRecurso = ?', [id]) as [any[], any];
    if (recurso.length === 0) {
      return new Response('Recurso no encontrado', { status: 404 });
    }

    // Elimina el recurso
    await pool.query('DELETE FROM Recursos WHERE IdRecurso = ?', [id]);

    return new Response(JSON.stringify({ message: 'Recurso eliminado correctamente' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Error en DELETE recursos:', err);
    return new Response('Error al eliminar recurso', { status: 500 });
  }
}
