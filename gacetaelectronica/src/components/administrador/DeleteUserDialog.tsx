"use client"

import { Button } from "@/components/ui/button"
import CustomDialog from "../Dialog"
import { UserInterface } from "@/entities/user"

interface EliminarUsuarioDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  usuario: UserInterface
  onConfirm: () => void
}

export default function DeleteUserDialog({
  isOpen,
  setIsOpen,
  usuario,
  onConfirm,
}: EliminarUsuarioDialogProps) {
  return (
    <CustomDialog
      isOpen={isOpen}
      setIsOpen={(open) => {
        setIsOpen(open)
        if (!open) {
          // Optional: reset logic if needed
        }
      }}
      title="Eliminar Usuario"
      description="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Eliminar
          </Button>
        </div>
      }
    >
      <p>
        Estás a punto de eliminar al usuario <strong>{usuario.name}</strong> (
        {usuario.email}). Esta acción no se puede deshacer.
      </p>
    </CustomDialog>
  )
}
