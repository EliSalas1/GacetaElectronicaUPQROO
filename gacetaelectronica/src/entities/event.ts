export interface EventInterface {
  IdEvento: number
  Nombre: string
  Fecha: string // formato YYYY-MM-DD
  Hora: string // formato HH:MM
  Lugar: string
  DesCorta: string
  DesLarga?: string
  status: 'published' | 'pending' | 'draft' | 'cancelled'
}
