import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';

//  Filtro de eventos por título
export async function GET(req: NextRequest) {
  try {
    const conn = await getConnection();
    const nombre = req.nextUrl.searchParams.get('nombre');

    if (!nombre) {
      return new Response('El parámetro "nombre" es requerido', { status: 400 });
    }

    const [rows] = await conn.query(
      `SELECT Nombre, DesCorta, DesLarga, Fecha, Hora, Lugar FROM Evento WHERE Nombre LIKE ?`,
      [`%${nombre}%`]
    );

    return Response.json(rows);
  } catch (err) {
    console.error(err);
    return new Response('Error al buscar eventos', { status: 500 });
  }
}
// 🧪 Endpoint: http://localhost:3000/api/filtros/eventos?nombre=Lanzamiento