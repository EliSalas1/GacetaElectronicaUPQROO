// src/app/api/buscador/route.ts
import { buscarGlobal } from '../buscadorServices';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const termino = searchParams.get('q') || '';

  try {
    const resultados = await buscarGlobal(termino);
    return NextResponse.json(resultados);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error en la búsqueda' },
      { status: 500 }
    );
  }
}