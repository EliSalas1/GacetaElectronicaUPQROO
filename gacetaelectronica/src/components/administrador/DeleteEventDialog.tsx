"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EventInterface } from "@/entities/event";
import { toast } from "sonner";


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
    await onConfirm(event.id);
    toast.success("Evento eliminado correctamente");
    onOpenChange(false);
  } catch (err: any) {
    console.error(err);
    toast.error("Error al eliminar el evento");
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
