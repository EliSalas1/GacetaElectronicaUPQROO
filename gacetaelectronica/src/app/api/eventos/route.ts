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
        .query('SELECT * FROM evento WHERE IdEvento = ?', [id]) as [any[], any];

      if ((rows as any[]).length === 0) {
        return new Response('Evento no encontrado', { status: 404 });
      }

      return Response.json((rows as any[])[0]); // Devuelve un evento específico
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

    // Verifica que no haya evento con el mismo nombre
    const [exists] = await conn
      .promise()
      .query('SELECT * FROM evento WHERE Nombre = ?', [nombre]);
    if ((exists as any[]).length > 0) {
      return new Response('Ya existe un evento con ese nombre', { status: 409 });
    }

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
// JSON Body:
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

    // Verifica que el ID exista
    const [exists] = await conn
      .promise()
      .query('SELECT * FROM evento WHERE IdEvento = ?', [id]);
    if ((exists as any[]).length === 0) {
      return new Response('Evento no encontrado', { status: 404 });
    }

    // Verifica que no exista otro evento con el mismo nombre
    const [duplicate] = await conn
      .promise()
      .query('SELECT * FROM evento WHERE Nombre = ? AND IdEvento != ?', [nombre, id]);
    if ((duplicate as any[]).length > 0) {
      return new Response('Ya existe otro evento con ese nombre', { status: 409 });
    }

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
// JSON Body igual que en POST

// ✅ Eliminar un evento por ID (?id=)
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');

    if (!id) return new Response('ID requerido', { status: 400 });

    const conn = await getConnection();

    // Verifica que el evento exista
    const [exists] = await conn
      .promise()
      .query('SELECT * FROM evento WHERE IdEvento = ?', [id]);
    if ((exists as any[]).length === 0) {
      return new Response('Evento no encontrado', { status: 404 });
    }

    await conn.promise().query('DELETE FROM evento WHERE IdEvento = ?', [id]);

    return Response.json({ message: 'Evento eliminado' });
  } catch (err) {
    console.error(err);
    return new Response('Error al eliminar evento', { status: 500 });
  }
}
// ✅ DELETE: http://localhost:3000/api/eventos?id=1
