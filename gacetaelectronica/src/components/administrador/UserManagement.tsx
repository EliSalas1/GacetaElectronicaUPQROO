"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import EditUserDialog from "./EditUserDialog";
import { UserInterface } from "@/entities/user";
import DeleteUserDialog from "./DeleteUserDialog";
import FilterSearchBar from "../FilterSearchBar";
import { Spinner } from "../Spinner";
import NuevoUsuariosDialog from "./NuevoUsuarioDialog";

export default function UserManagement() {
  const [usuarios, setUsuarios] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState<UserInterface[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
  const [isDialogUserOpen, setIsDialogUserOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ✅ Obtener usuarios desde API (ruta corregida)
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/usuarios"); // 👈 Asegúrate que tu handler esté aquí
      if (!res.ok) throw new Error("Error al cargar usuarios");
      const data: UserInterface[] = await res.json();
      setUsuarios(data);
      setFilteredData(data);
    } catch {
      toast.error("No se pudieron obtener los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    const result = usuarios
      .filter((u) => ["Admin", "Autor", "Revisor"].includes(u.Rol))
      .filter(
        (u) =>
          u.Nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
          u.Correo.toLowerCase().includes(searchValue.toLowerCase())
      );
    setFilteredData(result);
  }, [searchValue, usuarios]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return (
          <Badge className="bg-purple-100 text-purple-800">Administrador</Badge>
        );
      case "Autor":
        return <Badge className="bg-blue-100 text-blue-800">Autor</Badge>;
      case "Revisor":
        return <Badge className="bg-green-100 text-green-800">Revisor</Badge>;
      case "Usuario":
        return <Badge className="bg-green-100 text-green-800">Usuario</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge className="bg-green-100 text-green-800">Activo</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>
    );
  };

  const handleCreateUser = async (nuevo: Partial<UserInterface>) => {
    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo),
      });

      if (!res.ok) throw new Error(await res.text());
      toast.success("Usuario creado correctamente");
      fetchUsuarios();
    } catch (err: any) {
      toast.error(err.message || "Error al crear usuario");
    }
  };

  const handleOnUpdateUser = async (user: Partial<UserInterface>) => {
    const params = new URLSearchParams({ id: String(user.idUsuarios) });

    try {
      const response = await fetch(`/api/usuarios?${params.toString()}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error(await response.text());
      toast.success("Usuario actualizado correctamente");
      fetchUsuarios();
    } catch (err: any) {
      toast.error(err.message || "Error al actualizar usuario");
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const res = await fetch(`/api/usuarios?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(await res.text());
      toast.success("Usuario eliminado correctamente");
      fetchUsuarios();
    } catch (err: any) {
      toast.error(err.message || "Error al eliminar usuario");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestión de Usuarios</CardTitle>
              <CardDescription>
                Administra las cuentas de redactores y supervisores
              </CardDescription>
            </div>
            <div className="flex gap-4">
              <FilterSearchBar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                filterBy={""}
                onFilterByChange={() => {}}
                filterValue={""}
                onFilterValueChange={() => {}}
                availableFields={[]}
                getFilterValues={() => []}
              />
              <NuevoUsuariosDialog
                onCreate={handleCreateUser}
                initialUsuarios={usuarios.filter((u) => u.Rol === "Usuario")}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha de Creación</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <Spinner />
                  </TableCell>
                </TableRow>
              ) : filteredData.length > 0 ? (
                filteredData.map((user) => (
                  <TableRow key={user.idUsuarios}>
                    <TableCell>{user.Nombre}</TableCell>
                    <TableCell>{user.Correo}</TableCell>
                    <TableCell>{getRoleBadge(user.Rol)}</TableCell>
                    <TableCell>
                      {getStatusBadge(Boolean(user.Estado))}
                    </TableCell>
                    <TableCell>
                      {new Date(user.FechaCreacion).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDialogUserOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No hay usuarios encontrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedUser && (
        <>
          <EditUserDialog
            isOpen={isDialogUserOpen}
            setIsOpen={(open) => {
              setIsDialogUserOpen(open);
              if (!open) setSelectedUser(null);
            }}
            usuario={selectedUser}
            onSave={handleOnUpdateUser}
          />
          <DeleteUserDialog
            isOpen={isDeleteOpen}
            setIsOpen={(open) => {
              setIsDeleteOpen(open);
              if (!open) setSelectedUser(null);
            }}
            usuario={selectedUser}
            onConfirm={deleteUser}
          />
        </>
      )}
    </>
  );
}
