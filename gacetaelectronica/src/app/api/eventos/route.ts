import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';

// ✅ GET: Obtener todos los eventos o uno por ID
// GET: Obtener eventos con paginación
export async function GET(req: NextRequest) {
  try {
    const pool = await getConnection();
    
    // Parámetros de paginación
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '15');  // Número de eventos por página
    const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0'); // Página actual

    // Consulta con paginación
    const [rows] = await pool.query(
      `SELECT * FROM Evento 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    ) as [any[], any];
    
    return Response.json(rows);
  } catch (err) {
    console.error('Error al obtener eventos:', err);
    return new Response('Error al obtener eventos', { status: 500 });
  }
}

// ✅ POST: Crear nuevo evento
export async function POST(req: NextRequest) {
  try {
    const { nombre, desCorta, desLarga, fecha, hora, lugar } = await req.json();

    if (!nombre || !desCorta || !desLarga || !fecha || !hora || !lugar) {
      return new Response('Todos los campos son requeridos', { status: 400 });
    }

    const pool = await getConnection();
    const [exists] = await pool.query(
      'SELECT * FROM Evento WHERE Nombre = ?',
      [nombre.trim()]
    ) as [any[], any];
    if (exists.length > 0) {
      return new Response('Ya existe un evento con ese nombre', { status: 409 });
    }

    const [result] = await pool.query(
      `INSERT INTO Evento (Nombre, DesCorta, DesLarga, Fecha, Hora, Lugar)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre.trim(), desCorta.trim(), desLarga.trim(), fecha, hora, lugar.trim()]
    );

    return Response.json({
      message: 'Evento creado',
      id: (result as any).insertId,
    });
  } catch (err) {
    console.error('Error en POST eventos:', err);
    return new Response('Error al crear evento', { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    const { nombre, desCorta, desLarga, fecha, hora, lugar } = await req.json();

    if (!id || !nombre || !desCorta || !desLarga || !fecha || !hora || !lugar) {
      return new Response('Todos los campos son requeridos', { status: 400 });
    }

    const pool = await getConnection();

    // Verificar si el evento existe
    const [exists] = await pool.query('SELECT * FROM Evento WHERE IdEvento = ?', [id]) as [any[], any];
    if (exists.length === 0) {
      return new Response('Evento no encontrado', { status: 404 });
    }

    // Verificar si el nombre ya está registrado
    const [duplicate] = await pool.query(
      'SELECT * FROM Evento WHERE Nombre = ? AND IdEvento != ?',
      [nombre.trim(), id]
    ) as [any[], any];
    if (duplicate.length > 0) {
      return new Response('Ya existe otro evento con ese nombre', { status: 409 });
    }

    // Actualizar el evento
    await pool.query(
      `UPDATE Evento
       SET Nombre = ?, DesCorta = ?, DesLarga = ?, Fecha = ?, Hora = ?, Lugar = ?
       WHERE IdEvento = ?`,
      [nombre.trim(), desCorta.trim(), desLarga.trim(), fecha, hora, lugar.trim(), id]
    );

    return Response.json({ message: 'Evento actualizado' });
  } catch (err) {
    console.error('Error al actualizar evento:', err);
    return new Response('Error al actualizar evento', { status: 500 });
  }
}


// ✅ DELETE: Eliminar evento por ID
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id || isNaN(Number(id))) {
      return new Response('ID válido requerido', { status: 400 });
    }

    const pool = await getConnection();

    // Eliminar las filas relacionadas en UsuarioEvento
    await pool.query('DELETE FROM UsuarioEvento WHERE Evento_IdEvento = ?', [id]);

    // Verificar si el evento existe
    const [exists] = await pool.query('SELECT * FROM Evento WHERE IdEvento = ?', [id]) as [any[], any];
    if (exists.length === 0) {
      return new Response('Evento no encontrado', { status: 404 });
    }

    // Eliminar el evento
    await pool.query('DELETE FROM Evento WHERE IdEvento = ?', [id]);

    return Response.json({ message: 'Evento eliminado' });
  } catch (err) {
    console.error('Error en DELETE eventos:', err);
    return new Response('Error al eliminar evento', { status: 500 });
  }
}
