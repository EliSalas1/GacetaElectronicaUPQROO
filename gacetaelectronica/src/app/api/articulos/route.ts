import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';

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

// ✅ GET: Obtener artículos
export async function GET(req: NextRequest) {
  try {
    const pool = await getConnection();
    const id = req.nextUrl.searchParams.get('id');
    const include = req.nextUrl.searchParams.get('include') || '';

    if (id) {
      if (isNaN(Number(id))) {
        return new Response('ID inválido', { status: 400 });
      }

      const [rows] = await pool.query(
        'SELECT * FROM Articulos WHERE IdArticulo = ?', [id]
      ) as [Articulo[], any];

      if (rows.length === 0) {
        return new Response('Artículo no encontrado', { status: 404 });
      }

      const articulo = rows[0];

      if (include.includes('categoria')) {
        const [categoria] = await pool.query(
          'SELECT * FROM Categorias WHERE IdCategoria = ?', [articulo.IdCategoria]
        ) as [any[], any];
        articulo.Categoria = categoria[0];
      }

      if (include.includes('autor')) {
        const [autor] = await pool.query(
          'SELECT IdUsuarios, Nombre, Apellido FROM Usuarios WHERE IdUsuarios = ?', [articulo.IdAutor]
        ) as [any[], any];
        articulo.Autor = autor[0];
      }

      if (include.includes('revisor') && articulo.IdRevisor) {
        const [revisor] = await pool.query(
          'SELECT IdUsuarios, Nombre, Apellido FROM Usuarios WHERE IdUsuarios = ?', [articulo.IdRevisor]
        ) as [any[], any];
        articulo.Revisor = revisor[0];
      }

      if (include.includes('etiquetas')) {
        const [etiquetas] = await pool.query(` 
          SELECT e.* FROM Etiquetas e 
          JOIN ArticuloEtiqueta ae ON e.IdEtiqueta = ae.Etiquetas_IdEtiqueta 
          WHERE ae.Articulos_idArticulo = ?`, [id]
        ) as [any[], any];
        articulo.Etiquetas = etiquetas;
      }

      if (include.includes('recursos')) {
        const [recursos] = await pool.query(
          'SELECT * FROM Recursos WHERE articulos_idArticulo = ?', [id]
        ) as [any[], any];
        articulo.Recursos = recursos;
      }

      return Response.json(articulo);
    } else {
      const status = req.nextUrl.searchParams.get('status');
      const categoria = req.nextUrl.searchParams.get('categoria');
      const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10');
      const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0');

      if (isNaN(limit) || isNaN(offset) || limit < 0 || offset < 0) {
        return new Response('Parámetros de paginación inválidos', { status: 400 });
      }

      let query = 'SELECT * FROM Articulos';
      const params: (string | number)[] = [];

      if (status) {
        query += ' WHERE Estatus = ?';
        params.push(status);
      }

      if (categoria) {
        query += params.length ? ' AND' : ' WHERE';
        query += ' IdCategoria = ?';
        params.push(categoria);
      }

      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [rows] = await pool.query(query, params) as [any[], any];
      return Response.json(rows);
    }
  } catch (err) {
    console.error('Error en GET articulos:', err);
    return new Response('Error al obtener artículos', { status: 500 });
  }
}

// ✅ POST: Crear nuevo artículo
export async function POST(req: NextRequest) {
  try {
    const { Titulo, Resumen, Contenido, IdCategoria } = await req.json();

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
