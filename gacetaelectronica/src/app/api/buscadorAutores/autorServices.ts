// src/app/api/buscadorAutores/autorServices.ts
import getConnection from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';

export interface AutorResultado {
  id: number;
  nombre: string;
  apellido: string;
  nombreCompleto: string;
  correo: string;
  rol: string;
  estado: number;
  fechaCreacion: string;
  articulosCount?: number;
}

export async function buscarAutores(
  termino: string,
  filtros: {
    rol?: string;
    estado?: number;
  } = {}
): Promise<AutorResultado[]> {
  const pool = await getConnection();
  
  try {
    let query = `
      SELECT 
        u.IdUsuarios AS id,
        u.Nombre AS nombre,
        u.Apellido AS apellido,
        CONCAT(u.Nombre, ' ', u.Apellido) AS nombreCompleto,
        u.Correo AS correo,
        u.Rol AS rol,
        u.Estado AS estado,
        DATE_FORMAT(u.FechaCreacion, '%d/%m/%Y') AS fechaCreacion,
        COUNT(au.Articulos_idArticulo) AS articulosCount
      FROM Usuarios u
      LEFT JOIN ArticuloUsuario au ON u.IdUsuarios = au.Usuarios_idUsuarios
      WHERE (
        u.Nombre LIKE ? OR 
        u.Apellido LIKE ? OR 
        u.Correo LIKE ? OR
        CONCAT(u.Nombre, ' ', u.Apellido) LIKE ?
      )
    `;

    const params: any[] = [
      `%${termino}%`, 
      `%${termino}%`, 
      `%${termino}%`,
      `%${termino}%`
    ];

    // Aplicar filtros
    if (filtros.rol) {
      query += ' AND u.Rol = ?';
      params.push(filtros.rol);
    }
    if (filtros.estado !== undefined) {
      query += ' AND u.Estado = ?';
      params.push(filtros.estado);
    }

    query += ' GROUP BY u.IdUsuarios ORDER BY nombreCompleto LIMIT 50';

    const [rows] = await pool.query<RowDataPacket[]>(query, params);

    return rows.map(row => ({
      ...row,
      nombreCompleto: `${row.nombre} ${row.apellido}`
    })) as AutorResultado[];
  } catch (error) {
    console.error('Error en buscarAutores:', error);
    throw new Error('Error al buscar autores');
  }
}