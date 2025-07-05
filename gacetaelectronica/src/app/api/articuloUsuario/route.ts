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

// ✅ Crear relación Artículo-Usuario con múltiples inserciones
export async function POST(req: NextRequest) {
  try {
    const conn = await getConnection();
    const body = await req.json();

    const { articulos, usuarios } = body;

    if (!articulos || !usuarios || !Array.isArray(articulos) || !Array.isArray(usuarios)) {
      return new Response('Debes enviar arrays de articulos y usuarios', { status: 400 });
    }
    //Validar que los articulos existen
    const [articulosExist] = await conn.query(
      `SELECT IdArticulo FROM Articulos WHERE IdArticulo IN (${articulos.map(() => '?').join(',')})`,
      articulos
    );
    if ((articulosExist as any[]).length !== articulos.length) {
      return new Response('Uno o más articulos no existen', { status: 400 });
    }
    // 🔍 Validar que todos los usuarios existen
    const [usuariosExist] = await conn.query(
      `SELECT IdUsuarios FROM Usuarios WHERE IdUsuarios IN (${usuarios.map(() => '?').join(',')})`,
      usuarios
    );
    if ((usuariosExist as any[]).length !== usuarios.length) {
      return new Response('Uno o más usuarios no existen', { status: 400 });
    }

    // Insertar relaciones evitando duplicados
    for (const articuloId of articulos) {
      for (const usuarioId of usuarios) {
        const [existing] = await conn.query(
          `SELECT * FROM ArticuloUsuario WHERE Articulos_idArticulo = ? AND Usuarios_IdUsuarios = ?`,
          [articuloId, usuarioId]
        );

        if ((existing as any[]).length === 0) {
          await conn.query(
            `INSERT INTO ArticuloUsuario (Articulos_idArticulo, Usuarios_IdUsuarios) VALUES (?, ?)`,
            [articuloId, usuarioId]
          );
        }
      }
    }

    return Response.json({ message: 'Relaciones Artículo-Usuario creadas con éxito'});
  } catch (err) {
    console.error(err);
    return new Response('Error al crear relaciones Artículo-Usuario', { status: 500 });
  }
}

/*
🧪 Endpoint:
POST http://localhost:3000/api/articuloUsuario

📦 Body JSON de ejemplo:
{
  "articulos": [1],           // Puede ser [1, 2, 3]
  "usuarios": [2, 3, 4]       // Puede ser solo [2]
}
✔️ Este JSON insertará 3 relaciones: artículo 1 con usuarios 2, 3 y 4
*/