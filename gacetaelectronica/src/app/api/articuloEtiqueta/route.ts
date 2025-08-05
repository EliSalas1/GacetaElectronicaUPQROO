import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';

/// ✅ Obtener etiquetas por artículo o artículos por etiqueta (GET)
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
GET etiquetas segun articulo http://localhost:4000/api/articuloEtiqueta?articuloId=1
GET articulos segun etiqueta http://localhost:4000/api/articuloEtiqueta?etiquetaId=2
*/

// ✅ Crear relación Artículo-Etiqueta con múltiples inserciones
export async function POST(req: NextRequest) {
  try {
    const conn = await getConnection();
    const body = await req.json();

    const { articulos, etiquetas } = body;

    if (!articulos || !etiquetas || !Array.isArray(articulos) || !Array.isArray(etiquetas)) {
      return new Response('Debes enviar arrays de articulos y etiquetas', { status: 400 });
    }

    // 🔍 Validar existencia de artículos
    const [articulosExist] = await conn.query(
      `SELECT IdArticulo FROM Articulos WHERE IdArticulo IN (${articulos.map(() => '?').join(',')})`,
      articulos
    );
    if ((articulosExist as any[]).length !== articulos.length) {
      return new Response('Uno o más articulos no existen', { status: 400 });
    }

    // 🔍 Validar existencia de etiquetas
    const [etiquetasExist] = await conn.query(
      `SELECT IdEtiqueta FROM Etiquetas WHERE IdEtiqueta IN (${etiquetas.map(() => '?').join(',')})`,
      etiquetas
    );
    if ((etiquetasExist as any[]).length !== etiquetas.length) {
      return new Response('Uno o más etiquetas no existen', { status: 400 });
    }

    // Insertar relaciones evitando duplicados
    for (const articuloId of articulos) {
      for (const etiquetaId of etiquetas) {
        const [existing] = await conn.query(
          `SELECT * FROM ArticuloEtiqueta WHERE Articulos_idArticulo = ? AND Etiquetas_IdEtiqueta = ?`,
          [articuloId, etiquetaId]
        );

        if ((existing as any[]).length === 0) {
          await conn.query(
            `INSERT INTO ArticuloEtiqueta (Articulos_idArticulo, Etiquetas_IdEtiqueta) VALUES (?, ?)`,
            [articuloId, etiquetaId]
          );
        }
      }
    }

    return Response.json({ message: 'Relaciones Artículo-Etiqueta creadas con éxito'});
  } catch (err) {
    console.error(err);
    return new Response('Error al crear relaciones Artículo-Etiqueta', { status: 500 });
  }
}

/*
🧪 POST Endpoint:
http://localhost:4000/api/articuloEtiqueta

📦 Body JSON de ejemplo:
{
  "articulos": [1],
  "etiquetas": [2, 3]
}
*/

// ✅ Actualizar relación entre artículo y etiqueta (PUT)
export async function PUT(req: NextRequest) {
  try {
    const conn = await getConnection();
    const { articuloId, etiquetaId, nuevaEtiquetaId } = await req.json();

    if (!articuloId || !etiquetaId || !nuevaEtiquetaId) {
      return new Response('Se requieren articuloId, etiquetaId y nuevaEtiquetaId', { status: 400 });
    }

    // ✅ Actualizar la relación entre el artículo y la nueva etiqueta
    const [result]: any = await conn.query(
      `UPDATE ArticuloEtiqueta 
       SET Etiquetas_idEtiqueta = ? 
       WHERE Articulos_idArticulo = ? AND Etiquetas_idEtiqueta = ?`,
      [nuevaEtiquetaId, articuloId, etiquetaId]
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

// ✅ Eliminar relación entre artículo y etiqueta (DELETE)
export async function DELETE(req: NextRequest) {
  try {
    const conn = await getConnection();
    const articuloId = req.nextUrl.searchParams.get('articuloId');
    const etiquetaId = req.nextUrl.searchParams.get('etiquetaId');

    if (!articuloId || !etiquetaId) {
      return new Response('Se requieren articuloId y etiquetaId', { status: 400 });
    }

    // ✅ Eliminar la relación entre el artículo y la etiqueta
    const [result]: any = await conn.query(
      `DELETE FROM ArticuloEtiqueta 
       WHERE Articulos_idArticulo = ? AND Etiquetas_idEtiqueta = ?`,
      [articuloId, etiquetaId]
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
