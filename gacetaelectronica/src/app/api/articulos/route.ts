import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';
import Articulo from '@/app/publica/articulo/[id]/page';

interface Articulo {
  IdArticulo: number;
  Titulo: string;
  Resumen: string;
  Contenido: string;
  Estatus: number;
  FechaCreacion: string;
  FechaRevision?: string;
  Comentario?: string;
  IdCategoria: number;
  IdAutor: number;
  IdRevisor?: number;
  Categoria?: any;
  Autor?: any;
  Revisor?: any;
  Etiquetas?: any[];
  Recursos?: any[];
}
export async function GET(req: NextRequest) {
  try {
    const pool = await getConnection();

    const idParam = req.nextUrl.searchParams.get('id');
    const id = idParam ? parseInt(idParam) : null;

    // Si viene un ID, buscar solo ese artículo
    if (id && !isNaN(id) && id > 0) {
      const [rows] = await pool.query(
        `SELECT 
  a.Titulo AS Titulo,
  a.Resumen AS Resumen,
  a.Contenido AS Contenido,
  DATE_FORMAT(a.FechaCreacion, '%Y-%m-%d') AS createdAt,
  DATE_FORMAT(a.FechaRevision, '%Y-%m-%d') AS reviewedAt,
  a.Comentario AS comment,
  CASE a.Estatus
    WHEN 1 THEN 'published'
    WHEN 2 THEN 'pending'
    ELSE 'unknown'
  END AS status,
  COALESCE(c.Nombre, 'Sin Categoría') AS Categoria,
  COALESCE(u.Nombre, 'Sin autor') AS Autor,
  GROUP_CONCAT(DISTINCT e.Nombre) AS Etiqueta,
  GROUP_CONCAT(DISTINCT r.Ruta) AS Recursos

FROM Articulos a

LEFT JOIN Categorias c ON a.IdCategoria = c.IdCategoria

LEFT JOIN ArticuloUsuario au ON a.idArticulo = au.Articulos_idArticulo
LEFT JOIN Usuarios u ON au.Usuarios_idUsuarios = u.idUsuarios

LEFT JOIN ArticuloEtiqueta ae ON a.idArticulo = ae.Articulos_idArticulo
LEFT JOIN Etiquetas e ON ae.Etiquetas_IdEtiqueta = e.IdEtiqueta

LEFT JOIN Recursos r ON a.idArticulo = r.Articulos_idArticulo

WHERE a.idArticulo = ?
GROUP BY a.idArticulo
`,
        [id]
      );

      if (!rows || !Array.isArray(rows) || rows.length === 0) {
        return new Response('Artículo no encontrado', { status: 404 });
      }

      return Response.json(rows[0]);
    }

    // Si no hay ID, hacer consulta paginada
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10');
    const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0');

    if (isNaN(limit) || isNaN(offset) || limit < 0 || offset < 0) {
      return new Response('Parámetros de paginación inválidos', { status: 400 });
    }

    const [rows] = await pool.query(
      `SELECT 
         a.IdArticulo AS id,
         a.Titulo AS title,
         DATE_FORMAT(a.FechaCreacion, '%Y-%m-%d') AS createdAt,
         CASE a.Estatus
           WHEN 1 THEN 'published'
           WHEN 2 THEN 'pending'
           ELSE 'unknown'
         END AS status,
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
       ORDER BY a.FechaCreacion DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return Response.json(rows);
  } catch (err) {
    console.error('Error en GET articulos:', err);
    return new Response('Error en el servidor', { status: 500 });
  }
}


// ✅ POST: Crear nuevo artículo
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Verificar si es una creación completa con recursos y etiquetas
    if (body.recursos || body.etiquetas) {
      return await createArticleWithRelations(body);
    }
    
    // Creación simple de artículo
    const { Titulo, Resumen, Contenido, IdCategoria } = body;

    if (!Titulo || !Resumen || !Contenido || !IdCategoria) {
      return new Response('Todos los campos son requeridos', { status: 400 });
    }

    const pool = await getConnection();

    // Verifica si la categoría existe
    const [categoriaExist] = await pool.query(
      'SELECT * FROM Categorias WHERE IdCategoria = ?', [IdCategoria]
    ) as [any[], any];

    if (categoriaExist.length === 0) {
      return new Response('Categoría no encontrada', { status: 404 });
    }

    // Inserta el nuevo artículo
    const [result] = await pool.query(
      `INSERT INTO Articulos (Titulo, Resumen, Contenido, IdCategoria, FechaCreacion, Estatus)
       VALUES (?, ?, ?, ?, NOW(), 1)`,
      [Titulo.trim(), Resumen.trim(), Contenido.trim(), IdCategoria]
    );

    return Response.json({
      message: 'Artículo creado',
      id: (result as any).insertId
    }, { status: 201 });
  } catch (err) {
    console.error('Error en POST articulos:', err);
    return new Response('Error al crear artículo', { status: 500 });
  }
}

// Función para crear artículo con relaciones en transacción
async function createArticleWithRelations(body: any) {
  const pool = await getConnection();
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Usa directamente el body recibido
    const { Titulo, Resumen, Contenido, IdCategoria, recursos, etiquetas } = body;

    if (!Titulo || !Resumen || !Contenido || !IdCategoria) {
      return new Response('Todos los campos son requeridos', { status: 400 });
    }

    // Verifica si la categoría existe
    const [categoriaExist] = await connection.query(
      'SELECT * FROM Categorias WHERE IdCategoria = ?', [IdCategoria]
    ) as [any[], any];

    if (categoriaExist.length === 0) {
      await connection.rollback();
      return new Response('Categoría no encontrada', { status: 404 });
    }

    // Inserta el nuevo artículo
    const [result] = await connection.query(
      `INSERT INTO Articulos (Titulo, Resumen, Contenido, IdCategoria, FechaCreacion, Estatus)
       VALUES (?, ?, ?, ?, NOW(), 1)`,
      [Titulo.trim(), Resumen.trim(), Contenido.trim(), IdCategoria]
    );

    const articuloId = (result as any).insertId;
    const recursosCreados = [];

    // Guardar recursos si existen
    if (recursos && Array.isArray(recursos) && recursos.length > 0) {
      for (const recurso of recursos) {
        const { nombre, ruta} = recurso;
        
        if (!nombre || !ruta) {
          await connection.rollback();
          return new Response('Datos de recurso incompletos (nombre y ruta son requeridos)', { status: 400 });
        }

        // Inserta el recurso (solo Nombre y Ruta)
        const [recursoResult] = await connection.query(
          'INSERT INTO Recursos (Nombre, Ruta, Articulos_idArticulo) VALUES (?, ?, ?)',
          [nombre, ruta, articuloId]
        );
        
        // Obtener el IdRecurso insertado y agregarlo al array de recursos creados
        const IdRecurso = (recursoResult as any).insertId;
        recursosCreados.push({
          IdRecurso,
          nombre,
          ruta
        });
      }
    }

    // Guardar etiquetas si existen
    if (etiquetas && Array.isArray(etiquetas) && etiquetas.length > 0) {
      for (const etiquetaId of etiquetas) {
        // Verifica si la etiqueta existe
        const [etiquetaExist] = await connection.query(
          'SELECT * FROM Etiquetas WHERE IdEtiqueta = ?', [etiquetaId]
        ) as [any[], any];
        
        if (etiquetaExist.length === 0) {
          await connection.rollback();
          return new Response(`Etiqueta con ID ${etiquetaId} no encontrada`, { status: 404 });
        }

        // Verifica si la relación ya existe
        const [relationExist] = await connection.query(
          'SELECT * FROM ArticuloEtiqueta WHERE Articulos_idArticulo = ? AND Etiquetas_IdEtiqueta = ?',
          [articuloId, etiquetaId]
        ) as [any[], any];
        
        if (relationExist.length === 0) {
          // Inserta la relación
          await connection.query(
            'INSERT INTO ArticuloEtiqueta (Articulos_idArticulo, Etiquetas_IdEtiqueta) VALUES (?, ?)',
            [articuloId, etiquetaId]
          );
        }
      }
    }

    await connection.commit();

    return Response.json({
      message: 'Artículo creado con relaciones',
      id: articuloId,
      recursosGuardados: recursos ? recursos.length : 0,
      recursos: recursosCreados,
      etiquetasGuardadas: etiquetas ? etiquetas.length : 0
    }, { status: 201 });

  } catch (err) {
    await connection.rollback();
    console.error('Error en createArticleWithRelations:', err);
    return new Response('Error al crear artículo con relaciones', { status: 500 });
  } finally {
    connection.release();
  }
}

// ✅ PUT: Actualizar artículo por ID
export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    const { Titulo, Resumen, Contenido, IdCategoria, Estatus } = await req.json();

    if (!id || isNaN(Number(id))) {
      return new Response('ID válido requerido', { status: 400 });
    }

    const pool = await getConnection();

    const [articuloExist] = await pool.query(
      'SELECT * FROM Articulos WHERE IdArticulo = ?', [id]
    ) as [any[], any];
    if (articuloExist.length === 0) {
      return new Response('Artículo no encontrado', { status: 404 });
    }

    if (IdCategoria) {
      const [categoriaExist] = await pool.query(
        'SELECT * FROM Categorias WHERE IdCategoria = ?', [IdCategoria]
      ) as [any[], any];
      if (categoriaExist.length === 0) {
        return new Response('Categoría no encontrada', { status: 404 });
      }
    }

    let query = 'UPDATE Articulos SET ';
    const params = [];
    const updates = [];

    if (Titulo) { updates.push('Titulo = ?'); params.push(Titulo.trim()); }
    if (Resumen) { updates.push('Resumen = ?'); params.push(Resumen.trim()); }
    if (Contenido) { updates.push('Contenido = ?'); params.push(Contenido.trim()); }
    if (IdCategoria) { updates.push('IdCategoria = ?'); params.push(IdCategoria); }
    if (Estatus !== undefined) { updates.push('Estatus = ?'); params.push(Estatus); }

    if (updates.length === 0) {
      return new Response('No hay datos para actualizar', { status: 400 });
    }

    query += updates.join(', ') + ' WHERE IdArticulo = ?';
    params.push(id);

    await pool.query(query, params);

    return Response.json({ message: 'Artículo actualizado' });
  } catch (err) {
    console.error('Error en PUT articulos:', err);
    return new Response('Error al actualizar artículo', { status: 500 });
  }
}

// ✅ DELETE: Eliminar artículo por ID
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id || isNaN(Number(id))) {
      return new Response('ID válido requerido', { status: 400 });
    }

    const pool = await getConnection();

    const [exist] = await pool.query(
      'SELECT * FROM Articulos WHERE IdArticulo = ?', [id]
    ) as [any[], any];
    if (exist.length === 0) {
      return new Response('Artículo no encontrado', { status: 404 });
    }

    await pool.query('DELETE FROM ArticuloEtiqueta WHERE articulos_idArticulo = ?', [id]);
    await pool.query('DELETE FROM Recursos WHERE articulos_idArticulo = ?', [id]);
    await pool.query('DELETE FROM Articulos WHERE IdArticulo = ?', [id]);

    return Response.json({ message: 'Artículo eliminado correctamente' });
  } catch (err) {
    console.error('Error en DELETE articulos:', err);
    return new Response('Error al eliminar artículo', { status: 500 });
  }

}