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
  DialogTitle,
  DialogFooter,
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

export default function AgregarEvento() {
  const [longDescription, setLongDescription] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    const payload = {
      nombre: formData.get('nombre')?.toString().trim(),
      desCorta: formData.get('desCorta')?.toString().trim(),
      desLarga: longDescription.trim(),
      fecha: formData.get('fecha')?.toString(),
      hora: formData.get('hora')?.toString(),
      lugar: formData.get('lugar')?.toString().trim(),
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
      toast.success(json.message || 'Evento creado correctamente')

      // Resetear formulario
      form.reset()
      setLongDescription('')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Ocurrió un error al crear el evento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-full mx-auto p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Agregar nuevo evento</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="form-evento" onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="nombre" className="text-lg">Título del evento</Label>
            <Input
              name="nombre"
              id="nombre"
              placeholder="Ej. Taller de diseño"
              required
              className="w-full p-3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="fecha" className="text-lg">Fecha</Label>
              <Input name="fecha" id="fecha" type="date" required className="w-full p-3" />
            </div>
            <div>
              <Label htmlFor="hora" className="text-lg">Hora</Label>
              <Input name="hora" id="hora" type="time" required className="w-full p-3" />
            </div>
            <div>
              <Label htmlFor="lugar" className="text-lg">Lugar</Label>
              <Input
                name="lugar"
                id="lugar"
                placeholder="Ej. Auditorio"
                required
                className="w-full p-3"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="desCorta" className="text-lg">Descripción corta</Label>
            <Textarea
              name="desCorta"
              id="desCorta"
              placeholder="Breve resumen del evento..."
              required
              className="w-full p-3"
            />
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" className="w-full py-3 mt-4">
                <PencilIcon className="mr-2 h-4 w-4" />
                Agregar descripción larga
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Descripción larga</DialogTitle>
                <DialogDescription>
                  Agrega más detalles sobre el evento.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                rows={6}
                placeholder="Información extendida del evento..."
                className="w-full p-3"
              />
              <DialogFooter>
                <Button onClick={() => setOpen(false)}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>

        {error && (
          <p className="text-sm text-red-500 mt-4">{error}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="form-evento"
          disabled={loading}
          className="w-full py-3 mt-4"
        >
          <CirclePlus className="mr-2" />
          {loading ? 'Creando...' : 'Crear Evento'}
        </Button>
      </CardFooter>
    </Card>
  )
}
