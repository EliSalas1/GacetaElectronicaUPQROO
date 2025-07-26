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
              value={form.Nombre}
              onChange={(e) => handleChange('Nombre', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="Fecha">Fecha</Label>
              <Input
                id="Fecha"
                type="date"
                value={form.Fecha}
                onChange={(e) => handleChange('Fecha', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="Hora">Hora</Label>
              <Input
                id="Hora"
                type="time"
                value={form.Hora}
                onChange={(e) => handleChange('Hora', e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="Lugar">Lugar</Label>
            <Input
              id="Lugar"
              value={form.Lugar}
              onChange={(e) => handleChange('Lugar', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="DesCorta">Descripción corta</Label>
            <Textarea
              id="DesCorta"
              value={form.DesCorta}
              onChange={(e) => handleChange('DesCorta', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="DesLarga">Descripción larga</Label>
            <Textarea
              id="DesLarga"
              value={form.DesLarga ?? ''}
              onChange={(e) => handleChange('DesLarga', e.target.value)}
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
