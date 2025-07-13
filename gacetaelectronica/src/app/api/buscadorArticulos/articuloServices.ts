// src/app/api/articulos/articuloServices.ts
import getConnection from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';

export interface ArticuloResultado {
  id: number;
  titulo: string;
  resumen: string;
  contenido: string;
  fecha_creacion: string;
  categoria: string;
  etiquetas: string[];
  autor: string;
  estado: number;
}

export async function buscarArticulos(
  termino: string,
  filtros: {
    categoria?: number;
    etiqueta?: number;
    fechaDesde?: string;
    fechaHasta?: string;
    estado?: number;
  } = {}
): Promise<ArticuloResultado[]> {
  const pool = await getConnection();
  
  try {
    let query = `
      SELECT 
        a.IdArticulo AS id,
        a.Titulo AS titulo,
        a.Resumen AS resumen,
        a.Contenido AS contenido,
        DATE_FORMAT(a.FechaCreacion, '%d/%m/%Y') AS fecha_creacion,
        c.Nombre AS categoria,
        CONCAT(u.Nombre, ' ', u.Apellido) AS autor,
        a.Estatus AS estado
      FROM Articulos a
      LEFT JOIN Categories c ON a.IdCategoria = c.IdCategoria
      LEFT JOIN ArticuloUsuario au ON a.IdArticulo = au.Articulos_idArticulo
      LEFT JOIN Usuarios u ON au.Usuarios_idUsuarios = u.IdUsuarios
      WHERE (a.Titulo LIKE ? OR a.Resumen LIKE ? OR a.Contenido LIKE ?)
    `;

    const params: any[] = [
      `%${termino}%`, 
      `%${termino}%`, 
      `%${termino}%`
    ];

    // Aplicar filtros
    if (filtros.categoria) {
      query += ' AND a.IdCategoria = ?';
      params.push(filtros.categoria);
    }
    if (filtros.etiqueta) {
      query += ' AND EXISTS (SELECT 1 FROM ArticuloEtiqueta ae WHERE ae.Articulos_idArticulo = a.IdArticulo AND ae.Etiquetas_IdEtiqueta = ?)';
      params.push(filtros.etiqueta);
    }
    if (filtros.fechaDesde) {
      query += ' AND a.FechaCreacion >= ?';
      params.push(filtros.fechaDesde);
    }
    if (filtros.fechaHasta) {
      query += ' AND a.FechaCreacion <= ?';
      params.push(filtros.fechaHasta);
    }
    if (filtros.estado !== undefined) {
      query += ' AND a.Estatus = ?';
      params.push(filtros.estado);
    }

    query += ' GROUP BY a.IdArticulo LIMIT 50';

    const [rows] = await pool.query<RowDataPacket[]>(query, params);

    // Obtener etiquetas para cada artículo
    const articulosConEtiquetas = await Promise.all(
      rows.map(async (row) => {
        const [etiquetas] = await pool.query<RowDataPacket[]>(`
          SELECT e.Nombre 
          FROM ArticuloEtiqueta ae
          JOIN Etiquetas e ON ae.Etiquetas_IdEtiqueta = e.IdEtiqueta
          WHERE ae.Articulos_idArticulo = ?
        `, [row.id]);

        return {
          ...row,
          etiquetas: etiquetas.map(e => e.Nombre)
        } as ArticuloResultado;
      })
    );

    return articulosConEtiquetas;
  } catch (error) {
    console.error('Error en buscarArticulos:', error);
    throw new Error('Error al buscar artículos');
  }
}