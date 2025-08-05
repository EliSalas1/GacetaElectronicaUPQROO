
import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';

//  Filtro de artículos por título
export async function GET(req: NextRequest) {
  try {
    const conn = await getConnection();

    const titulo = req.nextUrl.searchParams.get('titulo');

    if (!titulo) {
      return new Response('El parámetro "titulo" es requerido', { status: 400 });
    }

    const [rows] = await conn.query(
      `SELECT idArticulo, Titulo, Resumen, Comentario, Estatus, FechaCreacion 
       FROM Articulos 
       WHERE Titulo LIKE ?`,
      [`%${titulo}%`]
    );

    return Response.json(rows);
  } catch (err) {
    console.error(err);
    return new Response('Error al buscar artículos', { status: 500 });
  }
}
// 🧪 Endpoint:
//  http://localhost:4000/api/filtros/articulos?titulo=Tecnología