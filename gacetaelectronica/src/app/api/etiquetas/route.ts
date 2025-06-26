import { NextRequest } from 'next/server';
import getConnection from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const conn = await getConnection();
    const id = req.nextUrl.searchParams.get('id'); // Si hay un ID, consulta específica

    if (id) {
      const [rows] = await conn
        .promise()
        .query('SELECT * FROM etiquetas WHERE idEtiqueta = ?', [id]) as [any[], any];

      if (rows.length === 0) {
        return new Response('Etiqueta no encontrada', { status: 404 });
      }
      return Response.json(rows[0]);
    } else {
      const [rows] = await conn.promise().query('SELECT * FROM etiquetas'); // Todos los registros
      return Response.json(rows);
    }
  } catch (err) {
    console.error(err);
    return new Response('Error en la base de datos', { status: 500 });
  }
}
//ENDPOINT GET	http://localhost:3000/api/etiquetas
//ENDPOINT GET OBTENER POR ID http://localhost:3000/api/etiquetas?id=1

// ✅ Crear una nueva etiqueta
export async function POST(req: NextRequest) {
  try {
    const { nombre } = await req.json(); // Extrae el nombre del body de la solicitud

    if (!nombre) {
      return new Response('El nombre es requerido', { status: 400 });
    }

    const conn = await getConnection();
    const [result] = await conn
      .promise()
      .query('INSERT INTO etiquetas (Nombre) VALUES (?)', [nombre]); // Inserta en la tabla

    return Response.json({
      message: 'Etiqueta creada',
      id: (result as any).insertId, // Retorna el ID generado
    });
  } catch (err) {
    console.error(err);
    return new Response('Error al insertar', { status: 500 });
  }
}
//ENDPOINT POST	http://localhost:3000/api/etiquetas

// ✅ Actualizar una etiqueta por ID (pasado como query param: ?id=)
export async function PUT(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id'); // ID desde URL
    const { nombre } = await req.json(); // Nombre desde body

    if (!id || !nombre) {
      return new Response('ID y nombre son requeridos', { status: 400 });
    }

    const conn = await getConnection();
    const [result] = await conn
      .promise()
      .query('UPDATE etiquetas SET Nombre = ? WHERE idEtiqueta = ?', [nombre, id]); // Actualiza registro

    return Response.json({ message: 'Etiqueta actualizada' });
  } catch (err) {
    console.error(err);
    return new Response('Error al actualizar', { status: 500 });
  }
}
//ENDPOINT PUT	http://localhost:3000/api/etiquetas?id=1

// ✅ Eliminar una etiqueta por ID (pasado como query param: ?id=)
export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id'); // ID desde URL

    if (!id) return new Response('ID es requerido', { status: 400 });

    const conn = await getConnection();
    await conn.promise().query('DELETE FROM etiquetas WHERE idEtiqueta = ?', [id]); // Elimina el registro

    return Response.json({ message: 'Etiqueta eliminada' });
  } catch (err) {
    console.error(err);
    return new Response('Error al eliminar', { status: 500 });
  }
}
//ENDPOINT DELETE	http://localhost:3000/api/etiquetas?id=1
