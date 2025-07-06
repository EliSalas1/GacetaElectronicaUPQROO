import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';

// ✅ Obtener eventos de un usuario o usuarios de un evento
export async function GET(req: NextRequest) {
  try {
    const conn = await getConnection();
    const usuarioId = req.nextUrl.searchParams.get('usuarioId');
    const eventoId = req.nextUrl.searchParams.get('eventoId');

    if (usuarioId) {
      // ✅ Eventos en los que participó un usuario
      const [rows] = await conn.query(
        `SELECT e.IdEvento, e.Nombre, e.DesCorta, e.DesLarga, e.Fecha, e.Hora, e.Lugar
         FROM Evento e
         JOIN UsuarioEvento ue ON e.IdEvento = ue.Evento_IdEvento
         WHERE ue.Usuarios_IdUsuarios = ?`,
        [usuarioId]
      );
      return Response.json(rows);
    }

    if (eventoId) {
      // ✅ Usuarios que participaron en un evento
      const [rows] = await conn.query(
        `SELECT u.idUsuarios, u.Nombre, u.Correo
         FROM Usuarios u
         JOIN UsuarioEvento ue ON u.idUsuarios = ue.Usuarios_IdUsuarios
         WHERE ue.Evento_IdEvento = ?`,
        [eventoId]
      );
      return Response.json(rows);
    }

    return new Response('Se requiere usuarioId o eventoId', { status: 400 });
  } catch (err) {
    console.error(err);
    return new Response('Error en UsuarioEvento', { status: 500 });
  }
}
/*
🧪 Endpoints de prueba:
GET de eventos segun usuario http://localhost:3000/api/usuarioEvento?usuarioId=1
GET usuarios segun evento http://localhost:3000/api/usuarioEvento?eventoId=2
*/

// ✅ Crear relación Usuario - Evento
export async function POST(req: NextRequest) {
  try {
    const conn = await getConnection();
    const body = await req.json();

    const { usuariosId, eventosId } = body;

    if (!usuariosId || !eventosId) {
      return new Response('usuariosId y eventosId son requeridos', { status: 400 });
    }

    const usuarios = Array.isArray(usuariosId) ? usuariosId : [usuariosId];
    const eventos = Array.isArray(eventosId) ? eventosId : [eventosId];

    // ✅ Validar existencia de usuarios
    const [usuariosExist] = await conn.query(
      `SELECT idUsuarios FROM Usuarios WHERE idUsuarios IN (${usuarios.map(() => '?').join(',')})`,
      usuarios
    );
    if ((usuariosExist as any[]).length !== usuarios.length) {
      return new Response('Uno o más usuarios no existen', { status: 400 });
    }

    // ✅ Validar existencia de eventos
    const [eventosExist] = await conn.query(
      `SELECT IdEvento FROM Evento WHERE IdEvento IN (${eventos.map(() => '?').join(',')})`,
      eventos
    );
    if ((eventosExist as any[]).length !== eventos.length) {
      return new Response('Uno o más eventos no existen', { status: 400 });
    }

    // ✅ Insertar relaciones evitando duplicados
    for (const usuarioId of usuarios) {
      for (const eventoId of eventos) {
        const [existing] = await conn.query(
          `SELECT * FROM UsuarioEvento WHERE Usuarios_IdUsuarios = ? AND Evento_IdEvento = ?`,
          [usuarioId, eventoId]
        );

        if ((existing as any[]).length === 0) {
          await conn.query(
            `INSERT INTO UsuarioEvento (Usuarios_IdUsuarios, Evento_IdEvento) VALUES (?, ?)`,
            [usuarioId, eventoId]
          );
        }
      }
    }

    return Response.json({ message: 'Relación(es) Usuario-Evento creada(s)' });
  } catch (err) {
    console.error(err);
    return new Response('Error al crear relación Usuario-Evento', { status: 500 });
  }
}

/*
🧪 POST Endpoint:
http://localhost:3000/api/usuarioEvento

📦 JSON Body Ejemplo 1:
{
  "usuariosId": [1, 2], 
  "eventosId": 3
}
  Puede ser de esa forma o con mas eventos y solo un usuario
*/
// ✅ Actualizar relación Usuario - Evento (PUT)
export async function PUT(req: NextRequest) {
  try {
    const conn = await getConnection();
    const body = await req.json();

    const { usuarioId, eventoId, nuevoEventoId } = body;

    if (!usuarioId || !eventoId || !nuevoEventoId) {
      return new Response('usuarioId, eventoId y nuevoEventoId son requeridos', { status: 400 });
    }

    // ✅ Validar existencia del usuario
    const [usuarioExist] = await conn.query(
      `SELECT idUsuarios FROM Usuarios WHERE idUsuarios = ?`,
      [usuarioId]
    );
    if ((usuarioExist as any[]).length === 0) {
      return new Response('El usuario no existe', { status: 400 });
    }

    // ✅ Validar existencia del evento original
    const [eventoExist] = await conn.query(
      `SELECT IdEvento FROM Evento WHERE IdEvento = ?`,
      [eventoId]
    );
    if ((eventoExist as any[]).length === 0) {
      return new Response('El evento original no existe', { status: 400 });
    }

    // ✅ Validar existencia del nuevo evento
    const [nuevoEventoExist] = await conn.query(
      `SELECT IdEvento FROM Evento WHERE IdEvento = ?`,
      [nuevoEventoId]
    );
    if ((nuevoEventoExist as any[]).length === 0) {
      return new Response('El nuevo evento no existe', { status: 400 });
    }

    // ✅ Actualizar la relación entre el usuario y el evento
    await conn.query(
      `UPDATE UsuarioEvento 
       SET Evento_IdEvento = ? 
       WHERE Usuarios_IdUsuarios = ? AND Evento_IdEvento = ?`,
      [nuevoEventoId, usuarioId, eventoId]
    );

    return new Response('Relación actualizada correctamente', { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response('Error al actualizar relación Usuario-Evento', { status: 500 });
  }
}
// ✅ Eliminar relación Usuario - Evento (DELETE)
export async function DELETE(req: NextRequest) {
  try {
    const conn = await getConnection();
    const usuarioId = req.nextUrl.searchParams.get('usuarioId');
    const eventoId = req.nextUrl.searchParams.get('eventoId');

    if (!usuarioId || !eventoId) {
      return new Response('Se requieren usuarioId y eventoId', { status: 400 });
    }

    // ✅ Verificar si la relación existe
    const [existing] = await conn.query(
      `SELECT * FROM UsuarioEvento 
       WHERE Usuarios_IdUsuarios = ? AND Evento_IdEvento = ?`,
      [usuarioId, eventoId]
    );

    if ((existing as any[]).length === 0) {
      return new Response('La relación no existe', { status: 404 });
    }

    // ✅ Eliminar la relación entre el usuario y el evento
    await conn.query(
      `DELETE FROM UsuarioEvento 
       WHERE Usuarios_IdUsuarios = ? AND Evento_IdEvento = ?`,
      [usuarioId, eventoId]
    );

    return new Response('Relación eliminada correctamente', { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response('Error al eliminar relación Usuario-Evento', { status: 500 });
  }
}
