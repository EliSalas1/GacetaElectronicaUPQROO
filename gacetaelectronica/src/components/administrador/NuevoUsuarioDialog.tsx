'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash, Check } from "lucide-react";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

interface Props {
  initialUsuarios?: Usuario[];
}

export default function NuevoUsuariosDialog({ initialUsuarios = [] }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);

  const handleUpdateRol = (id: number, newRol: string) => {
    setUsuarios(prev =>
      prev.map(u => (u.id === id ? { ...u, rol: newRol } : u))
    );
  };

  const handleDelete = (id: number) => {
    setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  const handleEdit = (id: number) => {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) {
      alert(`Editar usuario: ${usuario.nombre}`);
    }
  };

  const handleAccept = (id: number) => {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) {
      alert(`Aceptar cambios para: ${usuario.nombre}`);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-none !w-2xl">
        <DialogHeader>
          <DialogTitle>Usuarios</DialogTitle>
          <DialogDescription>Lista de usuarios registrados en el sistema</DialogDescription>
        </DialogHeader>

        <div className="overflow-x-auto w-full flex justify-center">
          <table className="w-[600px] text-sm text-left border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border-b">Nombre</th>
                <th className="p-2 border-b">Email</th>
                <th className="p-2 border-b">Rol</th>
                <th className="p-2 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <td className="p-2 border-b">{usuario.nombre}</td>
                  <td className="p-2 border-b">{usuario.email}</td>
                  <td className="p-2 border-b">
                    <Select value={usuario.rol} onValueChange={(val) => handleUpdateRol(usuario.id, val)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="redactor">Redactor</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2 border-b space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(usuario.id)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(usuario.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Button size="sm" onClick={() => handleAccept(usuario.id)}>
                      <Check className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
