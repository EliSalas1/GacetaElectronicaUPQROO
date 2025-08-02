'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Plus, Pencil, Trash, Check } from "lucide-react";
import { toast } from "sonner";
import { UserInterface } from "@/entities/user";

export default function NuevoUsuariosDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [usuarios, setUsuarios] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/usuarios");
      if (!res.ok) throw new Error("Error al obtener usuarios");

      const data: UserInterface[] = await res.json();
      const soloUsuarios = data.filter(u => u.Rol === "Usuario");
      setUsuarios(soloUsuarios);
    } catch {
      toast.error("No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDialogOpen) {
      fetchUsuarios();
    }
  }, [isDialogOpen]);

  const handleUpdateRolLocal = (id: number, newRol: string) => {
    setUsuarios(prev =>
      prev.map(u => (u.idUsuarios === id ? { ...u, Rol: newRol } : u))
    );
  };

  const handleDelete = (id: number) => {
    setUsuarios(prev => prev.filter(u => u.idUsuarios !== id));
  };

  const handleEdit = (id: number) => {
    const usuario = usuarios.find(u => u.idUsuarios === id);
    if (usuario) {
      alert(`Editar usuario: ${usuario.Nombre}`);
    }
  };

  const handleAccept = async (id: number) => {
    const usuario = usuarios.find(u => u.idUsuarios === id);
    if (usuario) {
      try {
        const res = await fetch(`/api/usuarios?id=${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...usuario, Rol: usuario.Rol }),
        });

        if (!res.ok) throw new Error(await res.text());
        toast.success(`Rol actualizado para ${usuario.Nombre}`);
        setUsuarios(prev => prev.filter(u => u.idUsuarios !== id));
      } catch (err: any) {
        toast.error("Error al actualizar usuario: " + err.message);
      }
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
          <DialogDescription>Lista de usuarios con rol Usuario</DialogDescription>
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
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : usuarios.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">
                    No hay usuarios con rol Usuario.
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.idUsuarios} className="hover:bg-gray-50">
                    <td className="p-2 border-b">{usuario.Nombre}</td>
                    <td className="p-2 border-b">{usuario.Correo}</td>
                    <td className="p-2 border-b">
                      <Select
                        value={usuario.Rol}
                        onValueChange={(val) => handleUpdateRolLocal(usuario.idUsuarios, val)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Autor">Autor</SelectItem>
                          <SelectItem value="Revisor">Revisor</SelectItem>
                          <SelectItem value="Admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2 border-b space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(usuario.idUsuarios)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(usuario.idUsuarios)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => handleAccept(usuario.idUsuarios)}>
                        <Check className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
