"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EventInterface } from "@/entities/event";

interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  event: EventInterface | null;
  onConfirm: (id: number) => void; // Recibe el id del evento para eliminar
}

export function DeleteEventDialog({ open, onOpenChange, event, onConfirm }: Props) {
  if (!event) return null;

  const handleDelete = async () => {
    try {
      // Llamar a la función onConfirm que eliminará el evento
      await onConfirm(event.id); // Pasar el id del evento

      // Mostrar mensaje de éxito
      alert("Evento eliminado correctamente");
      onOpenChange(false); // Cerrar el modal de eliminación
    } catch (err: any) {
      console.error(err);
      // Mostrar mensaje de error
      alert("Error al eliminar el evento");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>¿Eliminar evento?</DialogTitle>
        </DialogHeader>
        <p>
          ¿Estás seguro de que deseas eliminar el evento <strong>&quot;{event.title}&quot;</strong>? Esta acción no se puede deshacer.
        </p>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
