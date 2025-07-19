// src/app/api/articulo/usuarios/route.ts
import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';

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
        `SELECT u.idUsuarios, u.Nombre, u.Apellido, u.Correo
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


// ✅ Crear nueva relación entre artículo y usuario (POST)
export async function POST(req: NextRequest) {
  try {
    const conn = await getConnection();
    const { articuloId, usuarioId } = await req.json();

    if (!articuloId || !usuarioId) {
      return new Response('Se requieren articuloId y usuarioId', { status: 400 });
    }

    // ✅ Comprobar si la relación ya existe
    const [existingRows] = await conn.query(
      `SELECT * FROM ArticuloUsuario 
       WHERE Articulos_idArticulo = ? AND Usuarios_idUsuarios = ?`,
      [articuloId, usuarioId]
    );

    // Verifica si hay resultados
    if (Array.isArray(existingRows) && existingRows.length > 0) {
      return new Response('La relación ya existe', { status: 400 });
    }


    // ✅ Insertar la relación entre artículo y usuario
    await conn.query(
      `INSERT INTO ArticuloUsuario (Articulos_idArticulo, Usuarios_idUsuarios) 
       VALUES (?, ?)`,
      [articuloId, usuarioId]
    );

    return new Response('Relación creada correctamente', { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response('Error al crear relación', { status: 500 });
  }
}
/*
🧪 Endpoint:
POST http://localhost:3000/api/articuloUsuario

📦 Body JSON de ejemplo:
{
  "articuloId": [25],           
  "usuarioId": [5]       
}
*/

// ✅ Actualizar relación entre artículo y usuario (PUT)
export async function PUT(req: NextRequest) {
  try {
    const conn = await getConnection();
    const { articuloId, usuarioId, nuevoUsuarioId } = await req.json();

    if (!articuloId || !usuarioId || !nuevoUsuarioId) {
      return new Response('Se requieren articuloId, usuarioId y nuevoUsuarioId', { status: 400 });
    }

    // ✅ Actualizar la relación entre el artículo y el nuevo usuario
    const [result]: any = await conn.query(
      `UPDATE ArticuloUsuario 
       SET Usuarios_idUsuarios = ? 
       WHERE Articulos_idArticulo = ? AND Usuarios_idUsuarios = ?`,
      [nuevoUsuarioId, articuloId, usuarioId]
    );

    // Verificamos si la actualización afectó filas
    if (result && result.affectedRows > 0) {
      return new Response('Relación actualizada correctamente', { status: 200 });
    } else {
      return new Response('No se encontró la relación para actualizar', { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return new Response('Error al actualizar relación', { status: 500 });
  }
}

// ✅ Eliminar relación entre artículo y usuario (DELETE)
export async function DELETE(req: NextRequest) {
  try {
    const conn = await getConnection();
    const articuloId = req.nextUrl.searchParams.get('articuloId');
    const usuarioId = req.nextUrl.searchParams.get('usuarioId');

    if (!articuloId || !usuarioId) {
      return new Response('Se requieren articuloId y usuarioId', { status: 400 });
    }

    // ✅ Eliminar la relación entre el artículo y el usuario
    const [result]: any = await conn.query(
      `DELETE FROM ArticuloUsuario 
       WHERE Articulos_idArticulo = ? AND Usuarios_idUsuarios = ?`,
      [articuloId, usuarioId]
    );

    // Verificamos si se eliminó correctamente
    if (result && result.affectedRows > 0) {
      return new Response('Relación eliminada correctamente', { status: 200 });
    } else {
      return new Response('No se encontró la relación para eliminar', { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return new Response('Error al eliminar relación', { status: 500 });
  }
}
