import { NextRequest } from "next/server";
import getConnection from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const pool = await getConnection();

    const limitParam = req.nextUrl.searchParams.get("limit");
    const hasLimit = limitParam !== null;
    const limit = parseInt(limitParam || "0", 10);

    let query = `
        SELECT 
          a.IdArticulo AS id,
          a.Titulo AS title,
          a.Resumen AS resumen,
          DATE_FORMAT(a.FechaCreacion, '%Y-%m-%d') AS createdAt,
          a.Estatus AS estatus,
          COALESCE(c.Nombre, 'Sin Categoría') AS category,
          COALESCE(u.Nombre, 'Sin autor') AS author
        FROM Articulos a
        LEFT JOIN Categorias c ON a.IdCategoria = c.IdCategoria
        LEFT JOIN (
          SELECT DISTINCT Articulos_idArticulo, Usuarios_idUsuarios
          FROM ArticuloUsuario
          LIMIT 1
        ) au ON a.IdArticulo = au.Articulos_idArticulo
        LEFT JOIN Usuarios u ON au.Usuarios_idUsuarios = u.idUsuarios
        WHERE a.Estatus = 1
        ORDER BY a.FechaCreacion DESC
    `;

    if (hasLimit && limit > 0) {
      query += ` LIMIT ${limit}`;
    }

    const [rows] = await pool.query(query);

    return Response.json(rows);
  } catch (err) {
    console.error("Error en GET articulosPublicados:", err);
    return new Response("Error en el servidor", { status: 500 });
  }
}
