'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { EventInterface } from '@/entities/event'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: EventInterface | null
  onSave: (event: EventInterface) => void
}

export function EditEventDialog({ open, onOpenChange, event, onSave }: Props) {
  const [form, setForm] = useState<EventInterface | null>(null)

  useEffect(() => {
    if (event) setForm(event)
  }, [event])

  if (!form) return null

  const handleChange = (field: keyof EventInterface, value: string) => {
    setForm((prev) => prev ? { ...prev, [field]: value } : prev)
  }

  const handleSave = () => {
    onSave(form)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Evento</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="time">Hora</Label>
              <Input
                id="time"
                type="time"
                value={form.time}
                onChange={(e) => handleChange('time', e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="location">Lugar</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="shortDescription">Descripción corta</Label>
            <Textarea
              id="shortDescription"
              value={form.shortDescription}
              onChange={(e) => handleChange('shortDescription', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="longDescription">Descripción larga</Label>
            <Textarea
              id="longDescription"
              value={form.longDescription ?? ''}
              onChange={(e) => handleChange('longDescription', e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
