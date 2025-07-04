// src/app/api/articulo/usuarios/route.ts
import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';
let connection = getConnection();

// ✅ Obtener usuarios de un artículo o artículos de un usuario
export async function GET(req: NextRequest) {
  try {
    const conn = await getConnection();
    const usuarioId = req.nextUrl.searchParams.get('usuarioId');
    const articuloId = req.nextUrl.searchParams.get('articuloId');

    if (usuarioId) {
      // ✅ Artículos asociados a un usuario
      const [rows] = await conn.query(
        `SELECT a.idArticulo, a.Titulo, a.Estatus, a.FechaCreacion
         FROM Articulos a
         JOIN ArticuloUsuario au ON a.idArticulo = au.Articulos_idArticulo
         WHERE au.Usuarios_idUsuarios = ?`,
        [usuarioId]
      );
      return Response.json(rows);
    }

    if (articuloId) {
      // ✅ Usuarios asociados a un artículo
      const [rows] = await conn.query(
        `SELECT u.idUsuarios, u.Nombre, u.Correo
         FROM Usuarios u
         JOIN ArticuloUsuario au ON u.idUsuarios = au.Usuarios_idUsuarios
         WHERE au.Articulos_idArticulo = ?`,
        [articuloId]
      );
      return Response.json(rows);
    }

    return new Response('Se requiere usuarioId o articuloId', { status: 400 });
  } catch (err) {
    console.error(err);
    return new Response('Error en ArticuloUsuario', { status: 500 });
  }
}
//Endpoint usuarios segun articulo http://localhost:3000/api/articuloUsuario/?articuloId=1
//Endpoint articulos segun usuario http://localhost:3000/api/articuloUsuario/?usuarioId=5

