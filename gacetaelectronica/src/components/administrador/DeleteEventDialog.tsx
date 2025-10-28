'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { EventInterface } from '@/entities/event'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: EventInterface | null
  onConfirm: () => void
}

export function DeleteEventDialog({ open, onOpenChange, event, onConfirm }: Props) {
  if (!event) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>¿Eliminar evento?</DialogTitle>
        </DialogHeader>
        <p>
          ¿Estás seguro de que deseas eliminar el evento <strong>&quot;{event.Nombre}&quot;</strong>? Esta acción no se puede deshacer.
        </p>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button variant="destructive" onClick={onConfirm}>Eliminar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
