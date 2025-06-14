import React, { useState } from 'react'
import CustomDialog from '../Dialog'
import { Button } from '../ui/button'
import { Label } from '@radix-ui/react-label'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserInterface } from '@/entities/user'

interface EditarUsuarioDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  usuario: UserInterface
  onSave: (updatedUser: {
    nombre: string
    rol: string
    estado: string
    email: string
  }) => void
}

export default function EditUserDialog({
  isOpen,
  setIsOpen,
  usuario,
  onSave,
}: EditarUsuarioDialogProps) {
    const [nombre, setNombre] = useState(usuario.name)
    const [rol, setRol] = useState(usuario.role)
    const [estado, setEstado] = useState(usuario.status)

    const handleGuardarCambios = () => {
      onSave({ nombre, rol, estado, email: usuario.email })
      setIsOpen(false)
    }


  return (
    <CustomDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Editar Usuario"
      description="Modifica la información del usuario"
      footer={
        <Button onClick={handleGuardarCambios} className="w-full">
          Guardar Cambios
        </Button>
      }
    >
      <div className="w-full">
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre completo"
        />
      </div>

      <div className="w-full">
        <Label htmlFor="rol">Rol</Label>
        <Select value={rol} onValueChange={setRol}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder="Selecciona un rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="redactor">Redactor</SelectItem>
            <SelectItem value="supervisor">Supervisor</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full">
        <Label htmlFor="estado">Estado</Label>
        <Select value={estado} onValueChange={setEstado}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="activo">Activo</SelectItem>
            <SelectItem value="inactivo">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full">
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input
          id="email"
          value={usuario.email}
          disabled
          className="opacity-70"
        />
      </div>
    </CustomDialog>
  )
}
