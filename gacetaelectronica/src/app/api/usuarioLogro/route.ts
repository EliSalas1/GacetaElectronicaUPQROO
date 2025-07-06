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

// ✅ Crear relación Usuario - Logro
export async function POST(req: NextRequest) {
  try {
    const conn = await getConnection();
    const body = await req.json();

    const { usuariosId, logrosId } = body;

    if (!usuariosId || !logrosId) {
      return new Response('usuariosId y logrosId son requeridos', { status: 400 });
    }

    const usuarios = Array.isArray(usuariosId) ? usuariosId : [usuariosId];
    const logros = Array.isArray(logrosId) ? logrosId : [logrosId];

    // ✅ Validar existencia de usuarios
    const [usuariosExist] = await conn.query(
      `SELECT idUsuarios FROM Usuarios WHERE idUsuarios IN (${usuarios.map(() => '?').join(',')})`,
      usuarios
    );
    if ((usuariosExist as any[]).length !== usuarios.length) {
      return new Response('Uno o más usuarios no existen', { status: 400 });
    }

    // ✅ Validar existencia de logros
    const [logrosExist] = await conn.query(
      `SELECT IdLogro FROM Logros WHERE IdLogro IN (${logros.map(() => '?').join(',')})`,
      logros
    );
    if ((logrosExist as any[]).length !== logros.length) {
      return new Response('Uno o más logros no existen', { status: 400 });
    }

    // ✅ Insertar relaciones evitando duplicados
    for (const usuarioId of usuarios) {
      for (const logroId of logros) {
        const [existing] = await conn.query(
          `SELECT * FROM UsuarioLogro WHERE Usuarios_IdUsuarios = ? AND Logros_IdLogro = ?`,
          [usuarioId, logroId]
        );

        if ((existing as any[]).length === 0) {
          await conn.query(
            `INSERT INTO UsuarioLogro (Usuarios_IdUsuarios, Logros_IdLogro) VALUES (?, ?)`,
            [usuarioId, logroId]
          );
        }
      }
    }

    return Response.json({ message: 'Relación(es) Usuario-Logro creada(s)' });
  } catch (err) {
    console.error(err);
    return new Response('Error al crear relación Usuario-Logro', { status: 500 });
  }
}

/*
🧪 POST Endpoint:
http://localhost:3000/api/usuarioLogro

📦 JSON Body Ejemplo 1:
{
  "usuariosId": 1,
  "logrosId": [2, 3]
}
Puede ser de esa forma o con mas usuarios y solo un logro
*/
