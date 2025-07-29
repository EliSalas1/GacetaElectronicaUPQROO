import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';
import bcrypt from "bcryptjs"; // Asegúrate de importar esto arriba

export async function GET(req: NextRequest) {
  try {
    const pool = await getConnection();
    const id = req.nextUrl.searchParams.get('id');
    const email = req.nextUrl.searchParams.get('email');

    if (id) {
      const [rows] = await pool.query('SELECT * FROM Usuarios WHERE idUsuarios = ?', [id]) as [any[], any];
      if (rows.length === 0) {
        return new Response(JSON.stringify({ message: 'Usuario no encontrado' }), { status: 404 });
      }
      return Response.json(rows[0]);
    } else if (email) {
      const [rows] = await pool.query('SELECT * FROM Usuarios WHERE Correo = ?', [email]) as [any[], any];
      if (rows.length === 0) {
        return new Response(JSON.stringify({ message: 'Usuario no encontrado' }), { status: 404 });
      }
      return Response.json(rows[0]);
    } else {
      const [rows] = await pool.query('SELECT * FROM Usuarios') as [any[], any];
      return Response.json(rows);
    }
  } catch (err) {
    console.error('Error en GET usuarios:', err);
    return new Response(JSON.stringify({ message: 'Error al obtener usuarios', error: err }), { status: 500 });
  }
}

// ✅ POST - Crear nuevo usuario
export async function POST(req: NextRequest) {
  try {
    const { Nombre, Apellido, Correo, Rol, Estado, Contraseña } = await req.json();

    if (!Nombre || !Apellido || !Correo || !Rol || Estado === undefined || !Contraseña) {
      return new Response('Todos los campos son requeridos', { status: 400 });
    }

    const pool = await getConnection();

    const [exists] = await pool.query(
      'SELECT * FROM Usuarios WHERE Correo = ?',
      [Correo.trim()]
    ) as [any[], any];

    if (exists.length > 0) {
      return new Response('Ya existe un usuario con ese correo', { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(Contraseña.trim(), 10); // ✅ Hashear la contraseña

    const [result] = await pool.query(
      `INSERT INTO Usuarios (Nombre, Apellido, Correo, Rol, Estado, Contraseña, FechaCreacion)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [Nombre.trim(), Apellido.trim(), Correo.trim(), Rol.trim(), Estado, hashedPassword]
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


// ✅ PUT - Actualizar un usuario
export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    const { Nombre, Apellido, Correo, Rol, Estado, Contraseña } = await req.json();

    if (!id || isNaN(Number(id)) || !Nombre || !Apellido || !Correo || !Rol || Estado === undefined || !Contraseña) {
      return new Response('ID válido y todos los campos son requeridos', { status: 400 });
    }

    const pool = await getConnection();

    const [user] = await pool.query('SELECT * FROM Usuarios WHERE idUsuarios = ?', [id]) as [any[], any];
    if (user.length === 0) {
      return new Response('Usuario no encontrado', { status: 404 });
    }

    const [duplicate] = await pool.query(
      'SELECT * FROM Usuarios WHERE Correo = ? AND idUsuarios != ?',
      [Correo.trim(), id]
    ) as [any[], any];
    if (duplicate.length > 0) {
      return new Response('Ya existe otro usuario con ese correo', { status: 409 });
    }

    await pool.query(
      `UPDATE Usuarios
       SET Nombre = ?, Apellido = ?, Correo = ?, Rol = ?, Estado = ?, Contraseña = ?
       WHERE idUsuarios = ?`,
      [Nombre.trim(), Apellido.trim(), Correo.trim(), Rol.trim(), Estado, Contraseña.trim(), id]
    );

    return Response.json({ message: 'Usuario actualizado correctamente' });
  } catch (err) {
    console.error('Error en PUT usuarios:', err);
    return new Response('Error al actualizar usuario', { status: 500 });
  }
}

// ✅ DELETE - Eliminar usuario
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id || isNaN(Number(id))) {
      return new Response('ID válido requerido para eliminar usuario', { status: 400 });
    }

    const pool = await getConnection();

    const [user] = await pool.query('SELECT * FROM Usuarios WHERE idUsuarios = ?', [id]) as [any[], any];
    if (user.length === 0) {
      return new Response('Usuario no encontrado', { status: 404 });
    }

    await pool.query('DELETE FROM Usuarios WHERE idUsuarios = ?', [id]);

    return Response.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error('Error en DELETE usuarios:', err);
    return new Response('Error al eliminar usuario', { status: 500 });
  }
}
