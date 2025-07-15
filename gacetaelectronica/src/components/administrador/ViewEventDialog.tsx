"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { EventInterface } from "@/entities/event"

type Props = {
  open: boolean
  onOpenChange: (value: boolean) => void
  event: EventInterface | null
}

export function ViewEventDialog({ open, onOpenChange, event }: Props) {
  if (!event) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Información del Evento</DialogTitle>
          <DialogDescription>
            Todos los detalles del evento seleccionado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <p><strong>Título:</strong> {event.Nombre}</p>
          <p><strong>Fecha:</strong> {event.Fecha}</p>
          <p><strong>Hora:</strong> {event.Hora}</p>
          <p><strong>Lugar:</strong> {event.Lugar}</p>
          <p><strong>Descripción Corta:</strong> {event.DesCorta}</p>
          {event.DesLarga && (
            <p><strong>Descripción Larga:</strong> {event.DesLarga}</p>
          )}
          {/* <p><strong>Estado:</strong> {event.status}</p> */}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
