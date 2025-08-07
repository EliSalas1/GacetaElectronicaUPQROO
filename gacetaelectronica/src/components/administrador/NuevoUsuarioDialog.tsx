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
import { Plus, Trash, Check } from "lucide-react";
import { toast } from "sonner";
import { UserInterface } from "@/entities/user";

export default function NuevoUsuariosDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [usuarios, setUsuarios] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)


  // Estado local para los roles editados
  const [roles, setRoles] = useState<{ [key: number]: string }>({});
  // Nuevo estado para confirmar rol Admin
  const [showAdminConfirm, setShowAdminConfirm] = useState(false);
  const [adminTargetUserId, setAdminTargetUserId] = useState<number | null>(null);

  const handleDelete = async () => {
    if (deleteUserId === null) return;

    const usuario = usuarios.find((u) => u.idUsuarios === deleteUserId);
    if (!usuario) return;

    try {
      const res = await fetch(`/api/usuarios?id=${deleteUserId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(await res.text());

      toast.success(`Usuario ${usuario.Nombre} eliminado`);
      setUsuarios((prev) => prev.filter((u) => u.idUsuarios !== deleteUserId));
    } catch (err: any) {
      toast.error("Error al eliminar usuario: " + err.message);
    } finally {
      setDeleteUserId(null);
      setConfirmOpen(false);
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

  useEffect(() => {
    if (isDialogOpen) fetchUsuarios();
  }, [isDialogOpen]);

  const handleUpdateRolLocal = (id: number, newRol: string) => {
    if (newRol === "Admin") {
      setAdminTargetUserId(id);
      setShowAdminConfirm(true);
      return;
    }

    setRoles((prev) => ({
      ...prev,
      [id]: newRol,
    }));
  };

  // const handleUpdateRolLocal = (id: number, newRol: string) => {
  //   setRoles((prev) => ({
  //     ...prev,
  //     [id]: newRol,
  //   }));
  // };
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

    <>
      {showAdminConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-none">
          <div className="bg-white rounded-xl p-6 shadow-2xl w-[340px] border border-yellow-400 z-[9999] pointer-events-auto">

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-2xl text-yellow-500">⚠</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                ¿Asignar rol de Administrador?
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                Este rol tiene acceso completo al sistema.<br />¿Estás seguro?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                  onClick={() => {
                    setShowAdminConfirm(false);
                    setAdminTargetUserId(null);
                  }}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                  onClick={() => {
                    if (adminTargetUserId !== null) {
                      setRoles((prev) => ({
                        ...prev,
                        [adminTargetUserId]: "Admin",
                      }));
                    }
                    setShowAdminConfirm(false);
                    setAdminTargetUserId(null);
                  }}
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}> */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        // Si se está mostrando el modal de advertencia, NO cierres el principal
        if (!showAdminConfirm) {
          setIsDialogOpen(open);
        }
      }}>

        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-white text-[#4C0000] border border-[#4C0000] hover:bg-[#4C0000] hover:text-white transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
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
                          onClick={() => {
                            setDeleteUserId(usuario.idUsuarios);
                            setConfirmOpen(true);
                          }}
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
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar usuario?</DialogTitle>
            <DialogDescription>
              Esta acción eliminará permanentemente al usuario. ¿Estás seguro?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setConfirmOpen(false);
                setDeleteUserId(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-[var(--color-vino)] text-white hover:bg-white hover:text-[var(--color-vino)] border border-[var(--color-vino)]"
            >
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </>
  );
}