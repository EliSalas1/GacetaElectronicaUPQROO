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
import { toast } from 'sonner'

export default function CreateEventForm() {
  const [longDescription, setLongDescription] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const payload = {
      nombre: formData.get('title')?.toString().trim(),
      desCorta: formData.get('shortDesc')?.toString().trim(),
      desLarga: longDescription.trim(),
      fecha: formData.get('date')?.toString(),
      hora: formData.get('time')?.toString(),
      lugar: formData.get('location')?.toString().trim(),
    }

    if (Object.values(payload).some((v) => !v)) {
      setError('Todos los campos son requeridos.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text)
      }

      const json = await res.json()
      alert(`✅ Evento creado con ID: ${json.id}`)
      toast.success(json.message || "Evento creado correctamente");
      setLongDescription('')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Ocurrió un error al crear el evento");
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Crear evento</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="event-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="mb-1" htmlFor="title">
              Título del Evento
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Ej. Fiesta universitaria"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4 md:grid-col-2">
            <div>
              <Label className="mb-1" htmlFor="date">
                Fecha
              </Label>
              <Input id="date" name="date" type="date" required />
            </div>
            <div>
              <Label className="mb-1" htmlFor="time">
                Hora
              </Label>
              <Input id="time" name="time" type="time" required />
            </div>
            <div>
              <Label className="mb-1" htmlFor="location">
                Lugar
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="Ej. Auditorio principal"
                required
              />
            </div>
          </div>

          <div>
            <Label className="mb-1" htmlFor="shortDesc">
              Descripción corta
            </Label>
            <Textarea
              id="shortDesc"
              name="shortDesc"
              rows={3}
              placeholder="Una breve descripción..."
              required
            />
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="cursor-pointer w-full"
                type="button"
                variant="outline"
              >
                <PencilIcon /> Agregar descripción larga
              </Button>
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
                <Button type="button" onClick={() => setOpen(false)}>
                  Guardar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>

        {error && (
          <p className="text-sm text-red-500 mt-2">
            ⚠️ {error}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="event-form"
          className="w-full cursor-pointer"
          disabled={loading}
        >
          <CirclePlus className="mr-2" />
          {loading ? 'Creando...' : 'Crear Evento'}
        </Button>
      </CardFooter>
    </Card>
  )
}
