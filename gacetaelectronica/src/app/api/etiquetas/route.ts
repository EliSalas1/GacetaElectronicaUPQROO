import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';

// ✅ Obtener todas las etiquetas o una por ID (?id=)
export async function GET(req: NextRequest) {
  try {
    const conn = await getConnection();
    const id = req.nextUrl.searchParams.get('id');

    if (id) {
      const [rows] = await conn.promise().query('SELECT * FROM etiquetas WHERE idEtiqueta = ?', [id]) as [any[], any];
      if (rows.length === 0) {
        return new Response('Etiqueta no encontrada', { status: 404 });
      }
      return Response.json(rows[0]);
    } else {
      const [rows] = await conn.promise().query('SELECT * FROM etiquetas');
      return Response.json(rows);
    }
  } catch (err) {
    console.error(err);
    return new Response('Error en la base de datos', { status: 500 });
  }
}
// ✅ GET Todos: http://localhost:3000/api/etiquetas
// ✅ GET Por ID: http://localhost:3000/api/etiquetas?id=1

// ✅ Crear una nueva etiqueta
export async function POST(req: NextRequest) {
  try {
    const { nombre } = await req.json();
    if (!nombre || nombre.trim() === '') return new Response('El nombre es requerido', { status: 400 });

    const conn = await getConnection();
    const [duplicado] = await conn.promise().query('SELECT * FROM etiquetas WHERE Nombre = ?', [nombre]);
    if ((duplicado as any[]).length > 0) return new Response('Etiqueta duplicada', { status: 409 });

    const [result] = await conn.promise().query('INSERT INTO etiquetas (Nombre) VALUES (?)', [nombre]);
    return Response.json({ message: 'Etiqueta creada', id: (result as any).insertId });
  } catch (err) {
    console.error(err);
    return new Response('Error al insertar', { status: 500 });
  }
}
// ✅ POST: http://localhost:3000/api/etiquetas
// Body JSON:
// {
//   "nombre": "Nueva etiqueta"
// }

// ✅ Actualizar una etiqueta por ID (?id=)
export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    const { nombre } = await req.json();

    if (!id || !nombre || nombre.trim() === '') return new Response('ID y nombre son requeridos', { status: 400 });

    const conn = await getConnection();
    const [existente] = await conn.promise().query('SELECT * FROM etiquetas WHERE idEtiqueta = ?', [id]);
    if ((existente as any[]).length === 0) return new Response('ID no válido', { status: 404 });

    const [duplicado] = await conn.promise().query('SELECT * FROM etiquetas WHERE Nombre = ? AND idEtiqueta != ?', [nombre, id]);
    if ((duplicado as any[]).length > 0) return new Response('Etiqueta duplicada', { status: 409 });

    await conn.promise().query('UPDATE etiquetas SET Nombre = ? WHERE idEtiqueta = ?', [nombre, id]);
    return Response.json({ message: 'Etiqueta actualizada' });
  } catch (err) {
    console.error(err);
    return new Response('Error al actualizar', { status: 500 });
  }
}
// ✅ PUT: http://localhost:3000/api/etiquetas?id=1
// Body JSON:
// {
//   "nombre": "Nombre actualizado"
// }

// ✅ Eliminar una etiqueta por ID (?id=)
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return new Response('ID requerido', { status: 400 });

    const conn = await getConnection();
    const [existente] = await conn.promise().query('SELECT * FROM etiquetas WHERE idEtiqueta = ?', [id]);
    if ((existente as any[]).length === 0) return new Response('ID no válido', { status: 404 });

    await conn.promise().query('DELETE FROM etiquetas WHERE idEtiqueta = ?', [id]);
    return Response.json({ message: 'Etiqueta eliminada' });
  } catch (err) {
    console.error(err);
    return new Response('Error al eliminar', { status: 500 });
  }
}
// ✅ DELETE: http://localhost:3000/api/etiquetas?id=1
