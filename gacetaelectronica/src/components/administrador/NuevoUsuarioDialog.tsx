"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash, Check } from "lucide-react";
import { toast } from "sonner";
import { UserInterface } from "@/entities/user";

export default function NuevoUsuariosDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [usuarios, setUsuarios] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState(false);

  // Estado local para los roles editados
  const [roles, setRoles] = useState<{ [key: number]: string }>({});

  const handleDelete = async (id: number) => {
    const usuario = usuarios.find((u) => u.idUsuarios === id);
    if (!usuario) return;

    if (!confirm(`¿Estás seguro de eliminar al usuario ${usuario.Nombre}?`))
      return;

    try {
      const res = await fetch(`/api/usuarios?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(await res.text());

      toast.success(`Usuario ${usuario.Nombre} eliminado`);
      setUsuarios((prev) => prev.filter((u) => u.idUsuarios !== id));
    } catch (err: any) {
      toast.error("Error al eliminar usuario: " + err.message);
    }
  };

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/usuarios");
      if (!res.ok) throw new Error("Error al obtener usuarios");

      const data: UserInterface[] = await res.json();
      const soloUsuarios = data.filter((u) => u.Rol === "Usuario");
      setUsuarios(soloUsuarios);
    } catch {
      toast.error("No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDialogOpen) fetchUsuarios();
  }, [isDialogOpen]);

  const handleUpdateRolLocal = (id: number, newRol: string) => {
    setRoles((prev) => ({
      ...prev,
      [id]: newRol,
    }));
  };

  const handleAccept = async (id: number) => {
    const usuario = usuarios.find((u) => u.idUsuarios === id);
    const nuevoRol = roles[id];

    if (!usuario || !nuevoRol) {
      toast.error("Usuario o rol inválido.");
      return;
    }

    try {
      const res = await fetch(`/api/usuarios?id=${usuario.idUsuarios}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Nombre: usuario.Nombre,
          Apellido: usuario.Apellido,
          Correo: usuario.Correo,
          Rol: nuevoRol,
          Estado: usuario.Estado,
          // No se envía la contraseña (el backend ya no la requiere)
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      toast.success(`Rol actualizado para ${usuario.Nombre}`);
      // Remueve al usuario de la tabla ya que cambió de rol
      setUsuarios((prev) => prev.filter((u) => u.idUsuarios !== id));
    } catch (err: any) {
      toast.error("Error al actualizar usuario: " + err.message);
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
          <DialogDescription>
            Lista de usuarios con rol <strong>Usuario</strong> para reasignar
            rol.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-x-auto w-full flex justify-center">
          <table className="w-[600px] text-sm text-left border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border-b">Nombre</th>
                <th className="p-2 border-b">Email</th>
                <th className="p-2 border-b">Nuevo Rol</th>
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
                        value={roles[usuario.idUsuarios] || ""}
                        onValueChange={(val) =>
                          handleUpdateRolLocal(usuario.idUsuarios, val)
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Autor">Autor</SelectItem>
                          <SelectItem value="Revisor">Revisor</SelectItem>
                          <SelectItem value="Admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2 border-b">
                      <Button
                        size="sm"
                        onClick={() => handleAccept(usuario.idUsuarios)}
                        disabled={!roles[usuario.idUsuarios]}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(usuario.idUsuarios)}
                      >
                        <Trash className="h-4 w-4" />
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
