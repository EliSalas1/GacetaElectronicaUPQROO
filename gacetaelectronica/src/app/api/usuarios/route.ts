import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';

// GET - Obtener todos los usuarios o uno por ID
export async function GET(req: NextRequest) {
  try {
    const pool = await getConnection();
    const id = req.nextUrl.searchParams.get('id');

    if (id) {
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE idUsuarios = ?', [id]) as [any[], any];
      if (rows.length === 0) {
        return new Response('Usuario no encontrado', { status: 404 });
      }
      return Response.json(rows[0]);
    } else {
      const [rows] = await pool.query('SELECT * FROM usuarios');
      return Response.json(rows);
    }
  } catch (err) {
    console.error('Error en GET usuarios:', err);
    return new Response('Error al obtener usuarios', { status: 500 });
  }
}

// POST - Crear nuevo usuario
export async function POST(req: NextRequest) {
  try {
    const { Nombre, Apellido, Correo, Rol, Estado, Contraseña } = await req.json();

    if (!Nombre || !Apellido || !Correo || !Rol || Estado === undefined || !Contraseña) {
      return new Response('Todos los campos son requeridos', { status: 400 });
    }

    const pool = await getConnection();

    const [exists] = await pool.query('SELECT * FROM usuarios WHERE Correo = ?', [Correo]) as [any[], any];
    if (exists.length > 0) {
      return new Response('Ya existe un usuario con ese correo', { status: 409 });
    }

    const [result] = await pool.query(
      `INSERT INTO usuarios (Nombre, Apellido, Correo, Rol, Estado, Contraseña, FechaCreacion)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [Nombre, Apellido, Correo, Rol, Estado, Contraseña]
    );

    return Response.json({
      message: 'Usuario creado correctamente',
      id: (result as any).insertId,
    });
  } catch (err) {
    console.error('Error en POST usuarios:', err);
    return new Response('Error al crear usuario', { status: 500 });
  }
}

// PUT - Actualizar un usuario
export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    const { Nombre, Apellido, Correo, Rol, Estado, Contraseña } = await req.json();

    if (!id || !Nombre || !Apellido || !Correo || !Rol || Estado === undefined || !Contraseña) {
      return new Response('Todos los campos son requeridos', { status: 400 });
    }

    const pool = await getConnection();

    const [user] = await pool.query('SELECT * FROM usuarios WHERE idUsuarios = ?', [id]) as [any[], any];
    if (user.length === 0) {
      return new Response('Usuario no encontrado', { status: 404 });
    }

    const [duplicate] = await pool.query(
      'SELECT * FROM usuarios WHERE Correo = ? AND idUsuarios != ?',
      [Correo, id]
    ) as [any[], any];
    if (duplicate.length > 0) {
      return new Response('Ya existe otro usuario con ese correo', { status: 409 });
    }

    await pool.query(
      `UPDATE usuarios
       SET Nombre = ?, Apellido = ?, Correo = ?, Rol = ?, Estado = ?, Contraseña = ?
       WHERE idUsuarios = ?`,
      [Nombre, Apellido, Correo, Rol, Estado, Contraseña, id]
    );

    return Response.json({ message: 'Usuario actualizado correctamente' });
  } catch (err) {
    console.error('Error en PUT usuarios:', err);
    return new Response('Error al actualizar usuario', { status: 500 });
  }
}

// DELETE - Eliminar usuario
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return new Response('ID es requerido para eliminar usuario', { status: 400 });
    }

    const pool = await getConnection();

    const [user] = await pool.query('SELECT * FROM usuarios WHERE idUsuarios = ?', [id]) as [any[], any];
    if (user.length === 0) {
      return new Response('Usuario no encontrado', { status: 404 });
    }

    await pool.query('DELETE FROM usuarios WHERE idUsuarios = ?', [id]);

    return Response.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error('Error en DELETE usuarios:', err);
    return new Response('Error al eliminar usuario', { status: 500 });
  }
}
