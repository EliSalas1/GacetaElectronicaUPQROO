import { buscarAutores } from './autorServices';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  try {
    const resultados = await buscarAutores(
      searchParams.get('q') || '',
      {
        rol: searchParams.get('rol') || undefined,
        estado: searchParams.get('estado') ? Number(searchParams.get('estado')) : undefined
      }
    );

    return NextResponse.json(resultados);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error en búsqueda de autores' },
      { status: 500 }
    );
  }
}