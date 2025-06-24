export interface EventInterface {
  id: number
  title: string
  date: string // formato YYYY-MM-DD
  time: string // formato HH:MM
  location: string
  shortDescription: string
  longDescription?: string
  status: 'published' | 'pending' | 'draft' | 'cancelled'
}
