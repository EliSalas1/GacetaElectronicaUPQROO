import getConnection from '@/lib/db'

export interface ArticuloResultado {
  id: number;
  titulo: string;
  resumen: string;
  contenido: string;
  fecha_creacion: string;
  categoria: {
    id: number;
    nombre: string;
  };
  etiquetas: string[];
  recursos: string[];
  autor: {
    id: number;
    nombre: string;
  };
  estado: number;
}

export async function getArticulos(filters?: {
  search?: string;
  categoria?: string;
  autor?: string;
  estado?: string;
}): Promise<ArticuloResultado[]> {
  const pool = await getConnection();
  
  let query = `
    SELECT 
      a.IdArticulo AS id,
      a.Titulo AS titulo,
      a.Resumen AS resumen,
      a.Contenido AS contenido,
      a.FechaCreacion AS fecha_creacion,
      a.Estatus AS estado,
      c.IdCategoria AS categoria_id,
      c.Nombre AS categoria_nombre,
      u.IdUsuarios AS autor_id,
      CONCAT(u.Nombre, ' ', u.Apellido) AS autor_nombre
    FROM Articulos a
    LEFT JOIN Categorias c ON a.IdCategoria = c.IdCategoria
    LEFT JOIN ArticuloUsuario au ON a.IdArticulo = au.Articulos_idArticulo
    LEFT JOIN Usuarios u ON au.Usuarios_idUsuarios = u.IdUsuarios
    WHERE 1=1
  `;

  const params: any[] = [];

  // Búsqueda en título, contenido y autor
  if (filters?.search) {
    query += `
      AND (
        LOWER(a.Titulo) LIKE LOWER(?)
        OR LOWER(a.Contenido) LIKE LOWER(?)
        OR LOWER(CONCAT(u.Nombre, ' ', u.Apellido)) LIKE LOWER(?)
      )
    `;
    const likeSearch = `%${filters.search}%`;
    params.push(likeSearch, likeSearch, likeSearch);
  }

  if (filters?.categoria) {
    query += ' AND c.Nombre = ?';
    params.push(filters.categoria);
  }

  if (filters?.autor) {
    query += `
      AND LOWER(CONCAT(u.Nombre, ' ', u.Apellido)) LIKE LOWER(?)
    `;
    params.push(`%${filters.autor}%`);
  }

  if (filters?.estado) {
    query += ' AND a.Estatus = ?';
    params.push(filters.estado);
  }

  // Agrupar resultados por artículo
  query += ' GROUP BY a.IdArticulo';

  try {
    const [rows] = await pool.query<any[]>(query, params);
    
    // Obtener etiquetas y recursos para cada artículo
    const resultados: ArticuloResultado[] = await Promise.all(rows.map(async row => {
      // Etiquetas
      const [etiquetasRows] = await pool.query<any[]>(
        `SELECT e.Nombre 
         FROM ArticuloEtiqueta ae
         JOIN Etiquetas e ON ae.Etiquetas_IdEtiqueta = e.IdEtiqueta
         WHERE ae.Articulos_idArticulo = ?`, [row.id]
      );
      const etiquetas = etiquetasRows.map(e => e.Nombre);

      // Recursos
      const [recursosRows] = await pool.query<any[]>(
        `SELECT r.Ruta FROM Recursos r WHERE r.Articulos_idArticulo = ?`, [row.id]
      );
      const recursos = recursosRows.map(r => r.Ruta);

      return {
        id: row.id,
        titulo: row.titulo,
        resumen: row.resumen,
        contenido: row.contenido,
        fecha_creacion: row.fecha_creacion,
        categoria: {
          id: row.categoria_id,
          nombre: row.categoria_nombre
        },
        etiquetas,
        recursos,
        autor: {
          id: row.autor_id,
          nombre: row.autor_nombre
        },
        estado: row.estado
      };
    }));

    return resultados;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
}