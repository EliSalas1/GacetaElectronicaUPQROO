// src/app/api/resumen/articulos/route.ts
import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const pool = await getConnection();

    // Consulta agrupada para obtener los conteos por estatus
    const [rows] = await pool.query(`
      SELECT Estatus, COUNT(*) as total
      FROM Articulos
      GROUP BY Estatus
    `) as [any[], any];

    let totalArticulos = 0;
    let articulosPendientes = 0;
    let articulosPublicados = 0;
    let articulosRechazados = 0;

    // Asignar valores según el estatus
    for (const row of rows) {
      totalArticulos += row.total;
      switch (row.Estatus) {
        case 0:
          articulosPendientes = row.total;
          break;
        case 1:
          articulosPublicados = row.total;
          break;
        case 2:
          articulosRechazados = row.total;
          break;
      }
    }

    return Response.json({
      totalArticulos,
      articulosPendientes,
      articulosPublicados,
      articulosRechazados
    });
  } catch (err) {
    console.error('Error al obtener resumen de artículos:', err);
    return new Response('Error interno del servidor', { status: 500 });
  }
}
