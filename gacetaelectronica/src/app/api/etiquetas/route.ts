import getConnection from '@/lib/db';

export async function GET() {
  try {
    const conn = await getConnection();
    const [rows] = await conn.promise().query('SELECT * FROM etiquetas');
    return Response.json(rows);
  } catch (err) {
    return new Response('Error en la base de datos', { status: 500 });
  }
}
