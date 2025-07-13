// src/app/api/articulos/buscar/route.ts
import { buscarArticulos } from './articuloServices';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  try {
    const resultados = await buscarArticulos(
      searchParams.get('q') || '',
      {
        categoria: searchParams.get('categoria') ? Number(searchParams.get('categoria')) : undefined,
        etiqueta: searchParams.get('etiqueta') ? Number(searchParams.get('etiqueta')) : undefined,
        fechaDesde: searchParams.get('fechaDesde') || undefined,
        fechaHasta: searchParams.get('fechaHasta') || undefined,
        estado: searchParams.get('estado') ? Number(searchParams.get('estado')) : undefined
      }
    );

    return NextResponse.json(resultados);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error en búsqueda' },
      { status: 500 }
    );
  }
}