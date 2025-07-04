import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';

// ✅ Obtener etiquetas por artículo o artículos por etiqueta
export async function GET(req: NextRequest) {
  try {
    const conn = await getConnection();
    const etiquetaId = req.nextUrl.searchParams.get('etiquetaId');
    const articuloId = req.nextUrl.searchParams.get('articuloId');

    if (articuloId) {
      // ✅ Etiquetas de un artículo
      const [rows] = await conn.query(
        `SELECT e.idEtiqueta, e.Nombre
         FROM Etiquetas e
         JOIN ArticuloEtiqueta ae ON e.idEtiqueta = ae.Etiquetas_idEtiqueta
         WHERE ae.Articulos_idArticulo = ?`,
        [articuloId]
      );
      return Response.json(rows);
    }

    if (etiquetaId) {
      // ✅ Artículos que tienen esa etiqueta
      const [rows] = await conn.query(
        `SELECT a.idArticulo, a.Titulo, a.Estatus, a.FechaCreacion
         FROM Articulos a
         JOIN ArticuloEtiqueta ae ON a.idArticulo = ae.Articulos_idArticulo
         WHERE ae.Etiquetas_idEtiqueta = ?`,
        [etiquetaId]
      );
      return Response.json(rows);
    }

    return new Response('Se requiere etiquetaId o articuloId', { status: 400 });
  } catch (err) {
    console.error(err);
    return new Response('Error en ArticuloEtiqueta', { status: 500 });
  }
}
/*
GET etiquetas segun articulo http://localhost:3000/api/articuloEtiqueta?articuloId=1
GET articulos segun etiqueta http://localhost:3000/api/articuloEtiqueta?etiquetaId=2
*/
