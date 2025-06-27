// src/app/api/articulos/route.ts
import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';

// Tipos para TypeScript
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

// ✅ GET: Obtener artículos (todos, por ID o con filtros)
export async function GET(req: NextRequest) {
  try {
    const conn = await getConnection();
    const id = req.nextUrl.searchParams.get('id');
    const include = req.nextUrl.searchParams.get('include') || '';

    if (id) {
      // Validar que el ID sea numérico
      if (isNaN(Number(id))) {
        return new Response('ID inválido', { status: 400 });
      }

      const [rows] = await conn
        .promise()
        .query('SELECT * FROM articulos WHERE IdArticulo = ?', [id]) as [Articulo[], any];

      if (rows.length === 0) {
        return new Response('Artículo no encontrado', { status: 404 });
      }

      const articulo = rows[0];
      
      // Cargar relaciones según el parámetro include
      if (include.includes('categoria')) {
        const [categoria] = await conn
          .promise()
          .query('SELECT * FROM categorias WHERE IdCategoria = ?', [articulo.IdCategoria]);
        articulo.Categoria = categoria[0];
      }

      if (include.includes('autor')) {
        const [autor] = await conn
          .promise()
          .query('SELECT IdUsuarios, Nombre, Apellido FROM usuarios WHERE IdUsuarios = ?', [articulo.IdAutor]);
        articulo.Autor = autor[0];
      }

      if (include.includes('revisor') && articulo.IdRevisor) {
        const [revisor] = await conn
          .promise()
          .query('SELECT IdUsuarios, Nombre, Apellido FROM usuarios WHERE IdUsuarios = ?', [articulo.IdRevisor]);
        articulo.Revisor = revisor[0];
      }

      if (include.includes('etiquetas')) {
        const [etiquetas] = await conn
          .promise()
          .query(`
            SELECT e.* FROM etiquetas e
            JOIN articuloetiqueta ae ON e.IdEtiqueta = ae.Etiquetas_IdEtiqueta
            WHERE ae.Articulos_idArticulo = ?
          `, [id]);
        articulo.Etiquetas = etiquetas;
      }

      if (include.includes('recursos')) {
        const [recursos] = await conn
          .promise()
          .query('SELECT * FROM recursos WHERE Articulos_idArticulo = ?', [id]);
        articulo.Recursos = recursos;
      }

      return Response.json(articulo);
    } else {
      // Obtener todos los artículos con filtros básicos
      const status = req.nextUrl.searchParams.get('status');
      const categoria = req.nextUrl.searchParams.get('categoria');
      const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10');
      const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0');

      // Validar parámetros de paginación
      if (isNaN(limit) || isNaN(offset) || limit < 0 || offset < 0) {
        return new Response('Parámetros de paginación inválidos', { status: 400 });
      }

      let query = 'SELECT * FROM articulos';
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

      // Para MariaDB/MySQL necesitamos asegurarnos que LIMIT y OFFSET sean números
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [rows] = await conn.promise().query(query, params);
      return Response.json(rows);
    }
  } catch (err) {
    console.error('Error en GET:', err);
    return new Response('Error en la base de datos', { status: 500 });
  }
}

// ✅ POST: Crear nuevo artículo
export async function POST(req: NextRequest) {
  try {
    const {
      Titulo,
      Resumen,
      Contenido,
      IdCategoria,
      IdAutor
    } = await req.json();

    // Validaciones básicas
    if (!Titulo || !Resumen || !Contenido || !IdCategoria || !IdAutor) {
      return new Response('Todos los campos son requeridos', { status: 400 });
    }

    const conn = await getConnection();

    // Validar que exista la categoría
    const [categoriaExist] = await conn
      .promise()
      .query('SELECT * FROM categorias WHERE IdCategoria = ?', [IdCategoria]) as [any[], any];

    if (categoriaExist.length === 0) {
      return new Response('Categoría no encontrada', { status: 404 });
    }

    // Validar que exista el autor
    const [autorExist] = await conn
      .promise()
      .query('SELECT * FROM usuarios WHERE IdUsuarios = ? AND Rol = "autor"', [IdAutor]) as [any[], any];

    if (autorExist.length === 0) {
      return new Response('Autor no encontrado o no tiene rol válido', { status: 404 });
    }

    const [result] = await conn
      .promise()
      .query(
        'INSERT INTO articulos (Titulo, Resumen, Contenido, IdCategoria, IdAutor, FechaCreacion, Estatus) VALUES (?, ?, ?, ?, ?, NOW(), 1)',
        [Titulo, Resumen, Contenido, IdCategoria, IdAutor]
      );

    return Response.json({
      message: 'Artículo creado',
      id: (result as any).insertId,
    }, { status: 201 });
  } catch (err) {
    console.error('Error en POST:', err);
    return new Response('Error al insertar', { status: 500 });
  }
}

// ✅ PUT: Actualizar artículo por ID
export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    const {
      Titulo,
      Resumen,
      Contenido,
      IdCategoria,
      IdRevisor,
      Comentario,
      Estatus
    } = await req.json();

    // Validaciones
    if (!id || isNaN(Number(id))) {
      return new Response('ID válido requerido', { status: 400 });
    }

    const conn = await getConnection();

    // Validar que exista el artículo
    const [articuloExist] = await conn
      .promise()
      .query('SELECT * FROM articulos WHERE IdArticulo = ?', [id]) as [any[], any];

    if (articuloExist.length === 0) {
      return new Response('Artículo no encontrado', { status: 404 });
    }

    // Validar categoría si se va a actualizar
    if (IdCategoria) {
      const [categoriaExist] = await conn
        .promise()
        .query('SELECT * FROM categorias WHERE IdCategoria = ?', [IdCategoria]) as [any[], any];

      if (categoriaExist.length === 0) {
        return new Response('Categoría no encontrada', { status: 404 });
      }
    }

    // Validar revisor si se va a actualizar
    if (IdRevisor) {
      const [revisorExist] = await conn
        .promise()
        .query('SELECT * FROM usuarios WHERE IdUsuarios = ? AND Rol = "revisor"', [IdRevisor]) as [any[], any];

      if (revisorExist.length === 0) {
        return new Response('Revisor no encontrado o no tiene rol válido', { status: 404 });
      }
    }

    // Construir query dinámica
    let query = 'UPDATE articulos SET ';
    const params = [];
    const updates = [];

    if (Titulo) {
      updates.push('Titulo = ?');
      params.push(Titulo);
    }

    if (Resumen) {
      updates.push('Resumen = ?');
      params.push(Resumen);
    }

    if (Contenido) {
      updates.push('Contenido = ?');
      params.push(Contenido);
    }

    if (IdCategoria) {
      updates.push('IdCategoria = ?');
      params.push(IdCategoria);
    }

    if (IdRevisor) {
      updates.push('IdRevisor = ?');
      params.push(IdRevisor);
    }

    if (Comentario !== undefined) {
      updates.push('Comentario = ?');
      params.push(Comentario);
    }

    if (Estatus !== undefined) {
      updates.push('Estatus = ?');
      params.push(Estatus);
      
      if (Estatus === 3) { // Suponiendo que 3 es "Publicado"
        updates.push('FechaRevision = NOW()');
      }
    }

    if (updates.length === 0) {
      return new Response('No hay datos para actualizar', { status: 400 });
    }

    query += updates.join(', ') + ' WHERE IdArticulo = ?';
    params.push(id);

    await conn.promise().query(query, params);

    return Response.json({ message: 'Artículo actualizado' });
  } catch (err) {
    console.error('Error en PUT:', err);
    return new Response('Error al actualizar', { status: 500 });
  }
}

// ✅ DELETE: Eliminar artículo por ID
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');

    // Validación: ID requerido y numérico
    if (!id || isNaN(Number(id))) {
      return new Response('ID válido requerido', { status: 400 });
    }

    const conn = await getConnection();

    // Validación: existencia previa
    const [exist] = await conn
      .promise()
      .query('SELECT * FROM articulos WHERE IdArticulo = ?', [id]) as [any[], any];

    if (exist.length === 0) {
      return new Response('Artículo no encontrado', { status: 404 });
    }

    // Eliminar relaciones primero (etiquetas y recursos)
    await conn.promise().query(
      'DELETE FROM articuloetiqueta WHERE Articulos_idArticulo = ?',
      [id]
    );

    await conn.promise().query(
      'DELETE FROM recursos WHERE Articulos_idArticulo = ?',
      [id]
    );

    // Luego eliminar el artículo
    await conn.promise().query(
      'DELETE FROM articulos WHERE IdArticulo = ?',
      [id]
    );

    return Response.json({ message: 'Artículo eliminado correctamente' });
  } catch (err) {
    console.error('Error en DELETE:', err);
    return new Response('Error al eliminar', { status: 500 });
  }
}