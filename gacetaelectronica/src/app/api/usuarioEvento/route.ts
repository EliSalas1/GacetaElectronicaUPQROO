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
