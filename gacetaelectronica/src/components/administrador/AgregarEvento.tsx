'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { CirclePlus, PencilIcon } from 'lucide-react'

export default function CreateEventForm() {
  const [longDescription, setLongDescription] = useState('')
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí podrías enviar los datos a tu backend
    console.log('Formulario enviado')
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Crear evento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className='mb-1' htmlFor="title">Título del Evento</Label>
            <Input id="title" name="title" placeholder="Ej. Fiesta universitaria" required />
          </div>

          <div className="grid grid-cols-3 gap-4 md:grid-col-2">
            <div>
              <Label className='mb-1' htmlFor="date">Fecha</Label>
              <Input id="date" name="date" type="date" required />
            </div>
            <div>
              <Label className='mb-1' htmlFor="time">Hora</Label>
              <Input id="time" name="time" type="time" required />
            </div>
            <div>
              <Label className='mb-1' htmlFor="location">Lugar</Label>
              <Input id="location" name="location" placeholder="Ej. Auditorio principal" required />
            </div>
          </div>


          <div>
            <Label className='mb-1' htmlFor="shortDesc">Descripción corta</Label>
            <Textarea
              id="shortDesc"
              name="shortDesc"
              rows={3}
              placeholder="Una breve descripción..."
            />
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className='cursor-pointer w-full' type="button" variant="outline"><PencilIcon/> Agregar descripción larga</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Descripción larga</DialogTitle>
                <DialogDescription>
                  Aquí puedes escribir más detalles sobre el evento.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                rows={8}
                placeholder="Detalles extendidos del evento..."
              />
              <DialogFooter>
                <Button type="button" onClick={() => setOpen(false)}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="event-form" className="w-full cursor-pointer">
          <CirclePlus /> Crear Evento
        </Button>
      </CardFooter>
    </Card>
  )
}
