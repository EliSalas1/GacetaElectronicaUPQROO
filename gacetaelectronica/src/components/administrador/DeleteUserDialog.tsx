"use client"

import { Button } from "@/components/ui/button"
import CustomDialog from "../Dialog"
import { UserInterface } from "@/entities/user"
import { useState } from "react"
import { Spinner } from "../Spinner"

interface EliminarUsuarioDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  usuario: UserInterface
  onConfirm: (idUsuarios: number) => void
}

export default function DeleteUserDialog({
  isOpen,
  setIsOpen,
  usuario,
  onConfirm,
}: EliminarUsuarioDialogProps) {
  const [loading, setLoading] = useState(false)

  const onConfirmHandler = async () => {
    setLoading(true)
    await onConfirm(usuario.idUsuarios)
    setLoading(false)
  }

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
          <Button disabled={loading} variant={loading ? "ghost" : "destructive"} onClick={() => onConfirmHandler()}>
            {loading ? <Spinner/> : "Eliminar"}
          </Button>
        </div>
      }
    >
      <p>
        Estás a punto de eliminar al usuario <strong>{usuario.Nombre}</strong> (
        {usuario.Correo}). Esta acción no se puede deshacer.
      </p>
    </CustomDialog>
  )
}
