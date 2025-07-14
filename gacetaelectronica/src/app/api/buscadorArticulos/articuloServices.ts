import getConnection from '@/lib/db'


export interface ArticuloResultado {
  id: number;
  titulo: string;
  resumen: string;
  contenido: string;
  fecha_creacion: string;
  categoria: string;
  etiquetas: string[];
  recursos: string[];
  autor: string;
  estado: number;
}

export async function getArticulos(filters?: {
  search?: string
  categoria?: string
  autor?: string
  estado?: string
}): Promise<Articulo[]> {
  const pool = await getConnection()
  
  let query = `
    SELECT 
      a.IdArticulo AS id,
      a.Titulo AS titulo,
      a.Contenido AS contenido,
      a.FechaCreacion AS createdAt,
      a.Estatus AS estado,
      c.IdCategoria AS categoria_id,
      c.Nombre AS categoria_nombre,
      u.IdUsuario AS autor_id,
      CONCAT(u.Nombre, ' ', u.Apellido) AS autor_nombre
    FROM Articulos a
    LEFT JOIN Categories c ON a.IdCategoria = c.IdCategoria
    LEFT JOIN ArticuloUsuario au ON a.IdArticulo = au.ArticuloId
    LEFT JOIN Usuarios u ON au.UsuarioId = u.IdUsuario
    WHERE 1=1
  `

  const params: any[] = []

  if (filters?.search) {
    query += ' AND (a.Titulo LIKE ? OR a.Contenido LIKE ?)'
    params.push(`%${filters.search}%`, `%${filters.search}%`)
  }

  if (filters?.categoria) {
    query += ' AND c.Nombre = ?'
    params.push(filters.categoria)
  }

  if (filters?.autor) {
    query += ' AND CONCAT(u.Nombre, " ", u.Apellido) = ?'
    params.push(filters.autor)
  }

  if (filters?.estado) {
    query += ' AND a.Estatus = ?'
    params.push(filters.estado)
  }

  query += ' GROUP BY a.IdArticulo'

  try {
    const [rows] = await pool.query<any[]>(query, params)
    
    return rows.map(row => ({
      id: row.id,
      titulo: row.titulo,
      contenido: row.contenido,
      createdAt: row.createdAt,
      estado: row.estado,
      categoria: {
        id: row.categoria_id,
        nombre: row.categoria_nombre
      },
      autor: {
        id: row.autor_id,
        nombre: row.autor_nombre
      }
    }))
  } catch (error) {
    console.error('Error fetching articles:', error)
    throw error
  }
}