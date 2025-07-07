'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Edit, Trash2 } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { CardHeader } from '@/components/ui/card'
import { CardTitle } from '@/components/ui/card'
import { CardDescription } from '@/components/ui/card'
import { CardContent } from '@/components/ui/card'

import { Table } from '@/components/ui/table'
import { TableHeader } from '@/components/ui/table'
import { TableRow } from '@/components/ui/table'
import { TableHead } from '@/components/ui/table'
import { TableBody } from '@/components/ui/table'
import { TableCell } from '@/components/ui/table'

import { Button } from '@/components/ui/button'

import { EventInterface } from '@/entities/event'
import { EditEventDialog } from './EditEventDialog'
import { DeleteEventDialog } from './DeleteEventDialog'

const allEvents: EventInterface[] = [
  {
    id: 1,
    title: 'Conferencia IA 2025',
    date: '2025-07-10',
    time: '18:00',
    location: 'Auditorio Central',
    shortDescription: 'Evento sobre inteligencia artificial',
    longDescription: 'Detalles extensos de la conferencia...',
    status: 'published',
  },
  {
    id: 2,
    title: 'Feria de Ciencias',
    date: '2025-08-20',
    time: '10:00',
    location: 'Plaza principal',
    shortDescription: 'Feria estudiantil anual',
    status: 'pending',
  },
  {
    id: 3,
    title: 'Festival Cultural',
    date: '2025-09-01',
    time: '15:00',
    location: 'Teatro universitario',
    shortDescription: 'Música, danza y teatro',
    status: 'draft',
  },
]

export default function EventOverview() {
  const router = useRouter()
  const [selectedEvent, setSelectedEvent] = useState<EventInterface | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Todos los Eventos</CardTitle>
          <CardDescription>Vista general de los eventos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Lugar</TableHead>
                <TableHead>Descripción corta</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{event.date}</TableCell>
                  <TableCell>{event.time}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{event.shortDescription}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/administrador/evento/${event.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event)
                          setEditOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event)
                          setDeleteOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditEventDialog
        open={editOpen}
        onOpenChange={(value) => {
          setEditOpen(value)
          if (!value) setSelectedEvent(null)
        }}
        event={selectedEvent}
        onSave={(updatedEvent) => {
          console.log('Guardar evento', updatedEvent)
        }}
      />

      <DeleteEventDialog
        open={deleteOpen}
        onOpenChange={(value) => {
          setDeleteOpen(value)
          if (!value) setSelectedEvent(null)
        }}
        event={selectedEvent}
        onConfirm={() => {
          console.log('Eliminar evento:', selectedEvent?.id)
          setDeleteOpen(false)
        }}
      />
    </>
  )
}
