import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';

// ✅ Obtener todos los eventos o uno por ID (?id=)
export async function GET(req: NextRequest) {
  try {
    const conn = await getConnection();
    const id = req.nextUrl.searchParams.get('id');

    if (id) {
      const [rows] = await conn
        .promise()
        .query<any[]>('SELECT * FROM evento WHERE IdEvento = ?', [id]);

      if ((rows as any[]).length === 0) {
        return new Response('Evento no encontrado', { status: 404 });
      }

      return Response.json(rows[0]); // Devuelve evento específico
    } else {
      const [rows] = await conn.promise().query('SELECT * FROM evento');
      return Response.json(rows); // Devuelve todos los eventos
    }
  } catch (err) {
    console.error(err);
    return new Response('Error al obtener eventos', { status: 500 });
  }
}
// ✅ GET Todos: http://localhost:3000/api/eventos
// ✅ GET Por ID: http://localhost:3000/api/eventos?id=1

// ✅ Crear un nuevo evento
export async function POST(req: NextRequest) {
  try {
    const { nombre, desCorta, desLarga, fecha, hora, lugar } = await req.json();

    if (!nombre || !desCorta || !desLarga || !fecha || !hora || !lugar) {
      return new Response('Todos los campos son requeridos', { status: 400 });
    }

    const conn = await getConnection();
    const [result] = await conn.promise().query(
      `INSERT INTO evento (Nombre, DesCorta, DesLarga, Fecha, Hora, Lugar)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, desCorta, desLarga, fecha, hora, lugar]
    );

    return Response.json({
      message: 'Evento creado',
      id: (result as any).insertId,
    });
  } catch (err) {
    console.error(err);
    return new Response('Error al crear evento', { status: 500 });
  }
}
// ✅ POST: http://localhost:3000/api/eventos
// Body JSON:
// {
//   "nombre": "Feria tecnológica",
//   "desCorta": "Exposición de proyectos",
//   "desLarga": "Evento para mostrar innovaciones tecnológicas",
//   "fecha": "2025-07-01",
//   "hora": "10:00",
//   "lugar": "Auditorio UPQROO"
// }

// ✅ Actualizar un evento por ID (?id=)
export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    const { nombre, desCorta, desLarga, fecha, hora, lugar } = await req.json();

    if (!id || !nombre || !desCorta || !desLarga || !fecha || !hora || !lugar) {
      return new Response('Todos los campos son requeridos', { status: 400 });
    }

    const conn = await getConnection();
    await conn.promise().query(
      `UPDATE evento
       SET Nombre = ?, DesCorta = ?, DesLarga = ?, Fecha = ?, Hora = ?, Lugar = ?
       WHERE IdEvento = ?`,
      [nombre, desCorta, desLarga, fecha, hora, lugar, id]
    );

    return Response.json({ message: 'Evento actualizado' });
  } catch (err) {
    console.error(err);
    return new Response('Error al actualizar evento', { status: 500 });
  }
}
// ✅ PUT: http://localhost:3000/api/eventos?id=1
// Body JSON igual que en POST

// ✅ Eliminar un evento por ID (?id=)
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');

    if (!id) return new Response('ID requerido', { status: 400 });

    const conn = await getConnection();
    await conn.promise().query('DELETE FROM evento WHERE IdEvento = ?', [id]);

    return Response.json({ message: 'Evento eliminado' });
  } catch (err) {
    console.error(err);
    return new Response('Error al eliminar evento', { status: 500 });
  }
}
// ✅ DELETE: http://localhost:3000/api/eventos?id=1
