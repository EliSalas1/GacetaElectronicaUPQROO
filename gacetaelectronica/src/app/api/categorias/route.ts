import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';

// ✅ GET: Obtener categorías (todas o por ID)
export async function GET(req: NextRequest) {
  try {
    const conn = await getConnection();
    const id = req.nextUrl.searchParams.get('id');

    if (id) {
      // Validar que el ID sea numérico
      if (isNaN(Number(id))) {
        return new Response('ID inválido', { status: 400 });
      }

      const [rows] = await conn
        .promise()
        .query('SELECT * FROM categorias WHERE IdCategoria = ?', [id]) as [any[], any];

      // Validación: registro no encontrado
      if (rows.length === 0) {
        return new Response('Categoría no encontrada', { status: 404 });
      }

      return Response.json(rows[0]);
    } else {
      const [rows] = await conn.promise().query('SELECT * FROM categorias');
      return Response.json(rows);
    }
  } catch (err) {
    console.error('Error en GET:', err);
    return new Response('Error en la base de datos', { status: 500 });
  }
}
// ENDPOINTS:
//   GET todas: http://localhost:3000/api/categorias
//   GET por ID: http://localhost:3000/api/categorias?id=1

// ✅ POST: Crear nueva categoría
export async function POST(req: NextRequest) {
  try {
    const { nombre } = await req.json();

    // Validación: nombre obligatorio
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      return new Response('El nombre es requerido y debe ser texto válido', { status: 400 });
    }

    const conn = await getConnection();

    // Validación: evitar duplicados
    const [exist] = await conn
      .promise()
      .query('SELECT * FROM categorias WHERE Nombre = ?', [nombre.trim()]) as [any[], any];

    if (exist.length > 0) {
      return new Response('Ya existe una categoría con ese nombre', { status: 409 });
    }

    const [result] = await conn
      .promise()
      .query('INSERT INTO categorias (Nombre) VALUES (?)', [nombre.trim()]);

    return Response.json({
      message: 'Categoría creada',
      id: (result as any).insertId,
    });
  } catch (err) {
    console.error('Error en POST:', err);
    return new Response('Error al insertar', { status: 500 });
  }
}
// ENDPOINT POST: http://localhost:3000/api/categorias
// JSON Body:
// {
//   "nombre": "Cultura"
// }

// ✅ PUT: Actualizar categoría por ID 
export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    const { nombre } = await req.json();

    // Validaciones: campos requeridos
    if (!id || isNaN(Number(id))) {
      return new Response('ID válido requerido', { status: 400 });
    }

    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      return new Response('El nombre es requerido y debe ser texto válido', { status: 400 });
    }

    const conn = await getConnection();

    // Validación: existencia del ID
    const [exist] = await conn
      .promise()
      .query('SELECT * FROM categorias WHERE IdCategoria = ?', [id]) as [any[], any];

    if (exist.length === 0) {
      return new Response('Categoría no encontrada', { status: 404 });
    }

    // ✅ Validación: evitar duplicados (otro registro con el mismo nombre)
    const [duplicate] = await conn
      .promise()
      .query(
        'SELECT * FROM categorias WHERE Nombre = ? AND IdCategoria != ?',
        [nombre.trim(), id]
      ) as [any[], any];

    if (duplicate.length > 0) {
      return new Response('Ya existe otra categoría con ese nombre', { status: 409 });
    }

    await conn
      .promise()
      .query('UPDATE categorias SET Nombre = ? WHERE IdCategoria = ?', [nombre.trim(), id]);

    return Response.json({ message: 'Categoría actualizada' });
  } catch (err) {
    console.error('Error en PUT:', err);
    return new Response('Error al actualizar', { status: 500 });
  }
}
// ENDPOINT PUT: http://localhost:3000/api/categorias?id=1
// JSON Body:
// {
//   "nombre": "Culturas"
// }

// ✅ DELETE: Eliminar categoría por ID
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');

    // Validación: ID requerido y numérico
    if (!id || isNaN(Number(id))) {
      return new Response('ID válido requerido', { status: 400 });
    }

    const conn = await getConnection();

    // Validación: existencia previa
    const [exist] = await conn
      .promise()
      .query('SELECT * FROM categorias WHERE IdCategoria = ?', [id]) as [any[], any];

    if (exist.length === 0) {
      return new Response('Categoría no encontrada', { status: 404 });
    }

    await conn
      .promise()
      .query('DELETE FROM categorias WHERE IdCategoria = ?', [id]);

    return Response.json({ message: 'Categoría eliminada' });
  } catch (err) {
    console.error('Error en DELETE:', err);
    return new Response('Error al eliminar', { status: 500 });
  }
}
// ENDPOINT DELETE: http://localhost:3000/api/categorias?id=1
