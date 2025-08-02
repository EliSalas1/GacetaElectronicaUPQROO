'use client'

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EventInterface } from "@/entities/event";
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: EventInterface | null;
  onSave: (updatedEvent: EventInterface) => void;
}

export function EditEventDialog({ open, onOpenChange, event, onSave }: Props) {
  const [form, setForm] = useState<EventInterface | null>(null);
  const [error, setError] = useState<string | null>(null); // Estado para el mensaje de error

  useEffect(() => {
    if (event) {
      setForm(event);
    }
  }, [event]);

  if (!form) return null;

  const handleChange = (field: keyof EventInterface, value: string) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
    if (error) setError(null); // Limpiar el error cuando se cambian los valores
  };

  const handleSave = async () => {
    if (!form || !form.date) {
      setError("La fecha es obligatoria.");
      return;
    }

    try {
      const response = await fetch(`/api/eventos?id=${form.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: form.title,
          desCorta: form.shortDescription,
          desLarga: form.longDescription,
          fecha: form.date,
          hora: form.time,
          lugar: form.location,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el evento');
      }

      const result = await response.json();
      toast.success(result.message || 'Evento actualizado correctamente');
      
      onSave(form); 
      onOpenChange(false); 
    } catch (err: any) {
      toast.error(err.message || 'Ocurrió un error al guardar el evento');
    }
  };

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
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="time">Hora</Label>
              <Input
                id="time"
                type="time"
                value={form.time}
                onChange={(e) => handleChange("time", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="location">Lugar</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="shortDescription">Descripción corta</Label>
            <Textarea
              id="shortDescription"
              value={form.shortDescription}
              onChange={(e) => handleChange("shortDescription", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="longDescription">Descripción larga</Label>
            <Textarea
              id="longDescription"
              value={form.longDescription ?? ""}
              onChange={(e) => handleChange("longDescription", e.target.value)}
              rows={4}
            />
          </div>
        </div>
        {error && (
          <div className="text-red-500 text-sm">{error}</div> // Mostrar el mensaje de error
        )}
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!form.title || !form.date || !form.time}  // Deshabilita el botón si los campos esenciales están vacíos
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
