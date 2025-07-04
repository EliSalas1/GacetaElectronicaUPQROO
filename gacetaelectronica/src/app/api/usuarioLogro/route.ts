import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';

// ✅ Obtener logros de un usuario o usuarios que lograron algo
export async function GET(req: NextRequest) {
  try {
    const conn = await getConnection();
    const usuarioId = req.nextUrl.searchParams.get('usuarioId');
    const logroId = req.nextUrl.searchParams.get('logroId');

    if (usuarioId) {
      // ✅ Logros obtenidos por un usuario
      const [rows] = await conn.query(
        `SELECT l.IdLogro, l.Titulo, l.Descripcion
         FROM Logros l
         JOIN UsuarioLogro ul ON l.idLogro = ul.Logros_idLogro
         WHERE ul.Usuarios_idUsuarios = ?`,
        [usuarioId]
      );
      return Response.json(rows);
    }

    if (logroId) {
      // ✅ Usuarios que tienen un logro específico
      const [rows] = await conn.query(
        `SELECT u.idUsuarios, u.Nombre, u.Correo
         FROM Usuarios u
         JOIN UsuarioLogro ul ON u.idUsuarios = ul.Usuarios_idUsuarios
         WHERE ul.Logros_idLogro = ?`,
        [logroId]
      );
      return Response.json(rows);
    }

    return new Response('Se requiere usuarioId o logroId', { status: 400 });
  } catch (err) {
    console.error(err);
    return new Response('Error en UsuarioLogro', { status: 500 });
  }
}

/*
GET de logros segun usuario http://localhost:3000/api/usuarioLogro?usuarioId=1
GET de usuarios segun logros http://localhost:3000/api/usuarioLogro?logroId=2
*/
