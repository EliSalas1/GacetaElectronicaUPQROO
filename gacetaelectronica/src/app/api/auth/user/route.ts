import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';
import getConnection from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new Response('No autenticado', { status: 401 });
    }

    const pool = await getConnection();
    const [rows] = await pool.query(
      'SELECT idUsuarios, Nombre, Apellido, Correo, Rol FROM Usuarios WHERE Correo = ?',
      [session.user.email]
    ) as [any[], any];

    if (rows.length === 0) {
      return new Response('Usuario no encontrado', { status: 404 });
    }

    const user = rows[0];
    return Response.json({
      id: user.idUsuarios,
      name: user.Nombre,
      email: user.Correo,
      role: user.Rol
    });
  } catch (error) {
    console.error('Error al obtener información del usuario:', error);
    return new Response('Error interno del servidor', { status: 500 });
  }
} 