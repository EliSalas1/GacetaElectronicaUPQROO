import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const conn = await getConnection();
    const tipo = req.nextUrl.searchParams.get("tipo");

    let query = `
      SELECT a.idArticulo, a.Titulo, a.Resumen, a.Contenido, a.Comentario, a.Estatus, a.FechaCreacion, c.Nombre AS categoria
      FROM Articulos a
      LEFT JOIN Categorias c ON a.idCategoria = c.idCategoria
    `;

    // Agregamos condiciones según el tipo
    if (tipo === "pendientes") {
      query += `WHERE a.Estatus = 0 `;
    } else if (tipo === "Otros") {
      query += `WHERE a.Estatus IN (1, 2) `;
    } else {
      return new Response('Parámetro "tipo" inválido. Usa "pendientes" o "Otros".', { status: 400 });
    }

    query += `ORDER BY a.FechaCreacion DESC`;

    const [rows] = await conn.query(query);
    const slice = (rows as any[]);
    return Response.json(slice);
  } catch (err) {
    console.error('Error al obtener artículos:', err);
    return new Response('Error al obtener artículos', { status: 500 });
  }
}
// http://localhost:4000/api/filtros/articulosPendientes?tipo=pendientes
// http://localhost:4000/api/filtros/articulosPendientes?tipo=Otros