// src/app/api/buscadorServices.ts
import getConnection from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';

// Tipos TypeScript
export type ResultadoBusqueda = {
  tipo: 'articulo' | 'autor' | 'evento';
  id: number;
  titulo: string;
  metadata?: string;
  fecha?: string;
};

// Tipos para resultados de DB
interface ArticuloDB extends RowDataPacket {
  id: number;
  titulo: string;
  resumen?: string;
  fecha_creacion: string;
  categoria?: string;
}

interface AutorDB extends RowDataPacket {
  id: number;
  nombre_completo: string;
  rol?: string;
}

interface EventoDB extends RowDataPacket {
  id: number;
  nombre: string;
  fecha: string;
  lugar?: string;
}

/**
 * Busca artículos por título, resumen o contenido
 */
async function buscarArticulos(termino: string): Promise<ResultadoBusqueda[]> {
  const pool = await getConnection();
  try {
    const [rows] = await pool.query<ArticuloDB[]>(`
      SELECT 
        a.IdArticulo AS id,
        a.Titulo AS titulo,
        a.Resumen AS resumen,
        DATE_FORMAT(a.FechaCreacion, '%d/%m/%Y') AS fecha_creacion,
        c.Nombre AS categoria
      FROM Articulos a
      LEFT JOIN Categories c ON a.IdCategoria = c.IdCategoria
      WHERE a.Titulo LIKE ? OR a.Resumen LIKE ? OR a.Contenido LIKE ?
      LIMIT 10
    `, [`%${termino}%`, `%${termino}%`, `%${termino}%`]);

    return rows.map(row => ({
      tipo: 'articulo',
      id: row.id,
      titulo: row.titulo,
      metadata: row.categoria,
      fecha: row.fecha_creacion
    }));
  } catch (error) {
    console.error('Error buscando artículos:', error);
    return [];
  }
}

/**
 * Busca autores (usuarios) por nombre, apellido o correo
 */
async function buscarAutores(termino: string): Promise<ResultadoBusqueda[]> {
  const pool = await getConnection();
  try {
    const [rows] = await pool.query<AutorDB[]>(`
      SELECT 
        u.IdUsuarios AS id,
        CONCAT(u.Nombre, ' ', u.Apellido) AS nombre_completo,
        u.Rol AS rol
      FROM Usuarios u
      WHERE u.Nombre LIKE ? OR u.Apellido LIKE ? OR u.Correo LIKE ?
      LIMIT 5
    `, [`%${termino}%`, `%${termino}%`, `%${termino}%`]);

    return rows.map(row => ({
      tipo: 'autor',
      id: row.id,
      titulo: row.nombre_completo,
      metadata: row.rol
    }));
  } catch (error) {
    console.error('Error buscando autores:', error);
    return [];
  }
}

/**
 * Busca eventos por nombre o descripción
 */
async function buscarEventos(termino: string): Promise<ResultadoBusqueda[]> {
  const pool = await getConnection();
  try {
    const [rows] = await pool.query<EventoDB[]>(`
      SELECT 
        e.IdEvento AS id,
        e.Nombre AS nombre,
        DATE_FORMAT(e.Fecha, '%d/%m/%Y') AS fecha,
        e.Lugar AS lugar
      FROM Evento e
      WHERE e.Nombre LIKE ? OR e.DesCorta LIKE ?
      LIMIT 5
    `, [`%${termino}%`, `%${termino}%`]);

    return rows.map(row => ({
      tipo: 'evento',
      id: row.id,
      titulo: row.nombre,
      metadata: row.lugar,
      fecha: row.fecha
    }));
  } catch (error) {
    console.error('Error buscando eventos:', error);
    return [];
  }
}

/**
 * Búsqueda global unificada
 */
export async function buscarGlobal(
  termino: string,
  opciones: {
    articulos?: boolean;
    autores?: boolean;
    eventos?: boolean;
  } = { articulos: true, autores: true }
): Promise<ResultadoBusqueda[]> {
  if (!termino.trim()) return [];

  try {
    // Ejecutar búsquedas en paralelo
    const [articulos, autores, eventos] = await Promise.all([
      opciones.articulos ? buscarArticulos(termino) : Promise.resolve([]),
      opciones.autores ? buscarAutores(termino) : Promise.resolve([]),
      opciones.eventos ? buscarEventos(termino) : Promise.resolve([])
    ]);

    // Combinar y ordenar resultados
    return [...articulos, ...autores, ...eventos]
      .sort((a, b) => a.titulo.localeCompare(b.titulo));
  } catch (error) {
    console.error('Error en búsqueda global:', error);
    return [];
  }
}

/**
 * Búsqueda específica por tipo
 */
export async function buscarPorTipo(
  tipo: 'articulos' | 'autores' | 'eventos',
  termino: string
): Promise<ResultadoBusqueda[]> {
  switch (tipo) {
    case 'articulos':
      return await buscarArticulos(termino);
    case 'autores':
      return await buscarAutores(termino);
    case 'eventos':
      return await buscarEventos(termino);
    default:
      return [];
  }
}