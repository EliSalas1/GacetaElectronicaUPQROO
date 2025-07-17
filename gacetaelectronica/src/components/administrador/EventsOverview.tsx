'use client'

import { useState } from 'react'
import { Eye, Edit, Trash2 } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { CardHeader } from '@/components/ui/card'
import { CardTitle } from '@/components/ui/card'
import { CardDescription } from '@/components/ui/card'
import { CardContent } from '@/components/ui/card'

import { Table, TableFooter } from '@/components/ui/table'
import { TableHeader } from '@/components/ui/table'
import { TableRow } from '@/components/ui/table'
import { TableHead } from '@/components/ui/table'
import { TableBody } from '@/components/ui/table'
import { TableCell } from '@/components/ui/table'

import { Button } from '@/components/ui/button'

import { EventInterface } from '@/entities/event'
import { EditEventDialog } from './EditEventDialog'
import { DeleteEventDialog } from './DeleteEventDialog'
import { ViewEventDialog } from "./ViewEventDialog"
import FilterSearchBar from '../FilterSearchBar'
import { useFetch } from '@/hooks/useFetch'
import { Spinner } from '../Spinner'
import { Pagination } from '../Pagination'

export default function EventOverview() {
  const [selectedEvent, setSelectedEvent] = useState<EventInterface | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)

  const { data, loading } = useFetch<EventInterface>('/api/eventos')
  // const { data: dataEventos } = useFetch('/api/eventos')

  return (
    <>
      <Card>
        <CardHeader className='flex justify-between'>
          <div>
            <CardTitle>Todos los Eventos</CardTitle>
            <CardDescription>Vista general de los eventos registrados</CardDescription>
          </div>
          <FilterSearchBar 
            searchValue={""}
            onSearchChange={() => {}}
            filterBy={""}
            onFilterByChange={() => {}}
            filterValue={""}
            onFilterValueChange={() => {}}
            availableFields={[
              { label: "Categoría", value: "category" },
              { label: "Estado", value: "status" },
              { label: "Fecha", value: "createdAt" }
            ]}
            getFilterValues={(field) => []}
          />
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
              {loading ? <TableRow><TableCell colSpan={6} className="text-center flex justify-center"><Spinner/></TableCell></TableRow> : ""}
              {Array.isArray(data) && data.map((event) => (
                <TableRow key={event.IdEvento}>
                  <TableCell className="font-medium">{event.Nombre}</TableCell>
                  <TableCell>{event.Fecha}</TableCell>
                  <TableCell>{event.Hora}</TableCell>
                  <TableCell>{event.Lugar}</TableCell>
                  <TableCell>{event.DesCorta}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event)
                          setViewOpen(true)
                        }}
                      >
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
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}>
                  <Pagination
                    page={1}
                    onPageChange={() => {}}
                    totalItems={100}
                  />
                </TableCell>
              </TableRow>
            </TableFooter>
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
          console.log('Eliminar evento:', selectedEvent?.IdEvento)
          setDeleteOpen(false)
        }}
      />
      <ViewEventDialog
        open={viewOpen}
        onOpenChange={(value) => {
          setViewOpen(value)
          if (!value) setSelectedEvent(null)
        }}
        event={selectedEvent}
      />

    </>
  )
}
