// src/app/api/buscadorServices.ts
import getConnection from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';

// Interfaz base sin extender RowDataPacket
export interface ResultadoBusqueda {
  tipo: 'articulo' | 'autor' | 'evento';
  id: number;
  titulo: string;
  descripcion?: string;
  metadata?: string;
  fecha?: string;
}

// Tipo para resultados de consulta
type DBResult<T> = T & RowDataPacket;

// Función de mapeo segura
function mapResultado(row: DBResult<ResultadoBusqueda>): ResultadoBusqueda {
  return {
    tipo: row.tipo,
    id: row.id,
    titulo: row.titulo,
    descripcion: row.descripcion,
    metadata: row.metadata,
    fecha: row.fecha
  };
}

// Búsqueda de artículos
async function buscarArticulos(termino: string): Promise<ResultadoBusqueda[]> {
  const pool = await getConnection();
  const [rows] = await pool.query<DBResult<ResultadoBusqueda>[]>(`
    SELECT 
      'articulo' AS tipo,
      a.IdArticulo AS id,
      a.Titulo AS titulo,
      a.Resumen AS descripcion,
      DATE_FORMAT(a.FechaCreacion, '%d/%m/%Y') AS fecha,
      c.Nombre AS metadata
    FROM Articulos a
    LEFT JOIN Categories c ON a.IdCategoria = c.IdCategoria
    WHERE a.Titulo LIKE ? OR a.Resumen LIKE ?
    LIMIT 5
  `, [`%${termino}%`, `%${termino}%`]);

  return rows.map(mapResultado);
}

// Búsqueda de autores
async function buscarAutores(termino: string): Promise<ResultadoBusqueda[]> {
  const pool = await getConnection();
  const [rows] = await pool.query<DBResult<ResultadoBusqueda>[]>(`
    SELECT 
      'autor' AS tipo,
      u.IdUsuarios AS id,
      CONCAT(u.Nombre, ' ', u.Apellido) AS titulo,
      u.Rol AS metadata,
      DATE_FORMAT(u.FechaCreacion, '%d/%m/%Y') AS fecha
    FROM Usuarios u
    WHERE u.Nombre LIKE ? OR u.Apellido LIKE ?
    LIMIT 5
  `, [`%${termino}%`, `%${termino}%`]);

  return rows.map(mapResultado);
}

// Búsqueda de eventos
async function buscarEventos(termino: string): Promise<ResultadoBusqueda[]> {
  const pool = await getConnection();
  const [rows] = await pool.query<DBResult<ResultadoBusqueda>[]>(`
    SELECT 
      'evento' AS tipo,
      e.IdEvento AS id,
      e.Nombre AS titulo,
      e.DesCorta AS descripcion,
      DATE_FORMAT(e.Fecha, '%d/%m/%Y') AS fecha,
      e.Lugar AS metadata
    FROM Evento e
    WHERE e.Nombre LIKE ? OR e.DesCorta LIKE ?
    LIMIT 5
  `, [`%${termino}%`, `%${termino}%`]);

  return rows.map(mapResultado);
}

// Búsqueda global (sin cambios)
export async function buscarGlobal(termino: string): Promise<ResultadoBusqueda[]> {
  if (!termino.trim()) return [];

  try {
    const [articulos, autores, eventos] = await Promise.all([
      buscarArticulos(termino),
      buscarAutores(termino),
      buscarEventos(termino)
    ]);

    return [...articulos, ...autores, ...eventos]
      .sort((a, b) => a.titulo.localeCompare(b.titulo));
  } catch (error) {
    console.error('Error en buscarGlobal:', error);
    throw new Error('Error al realizar la búsqueda');
  }
}