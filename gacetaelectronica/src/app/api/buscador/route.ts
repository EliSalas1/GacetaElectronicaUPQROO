import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  // Simulación de respuesta - reemplaza con tu lógica real
  const mockResults = [
    {
      tipo: 'articulo',
      id: 1,
      titulo: 'Título del artículo encontrado',
      metadata: 'Categoría del artículo'
    },
    {
      tipo: 'evento', 
      id: 1,
      titulo: 'Evento próximo',
      metadata: 'Fecha del evento'
    }
  ];

  return NextResponse.json(query ? mockResults : []);
}