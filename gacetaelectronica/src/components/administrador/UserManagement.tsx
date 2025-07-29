"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import EditUserDialog from "./EditUserDialog";
import { UserInterface } from "@/entities/user";
import DeleteUserDialog from "./DeleteUserDialog";
import FilterSearchBar from "../FilterSearchBar";
import { useFetch } from "@/hooks/useFetch";
import { Spinner } from "../Spinner";
import NuevoUsuariosDialog from "./NuevoUsuarioDialog";

export default function UserManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogUserOpen, setIsDialogUserOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [serachValue, setSearchValue] = useState<string>("");
  const { data, loading } = useFetch<UserInterface[]>('api/usuarios');
  const [filteredData, setFilteredData] = useState<UserInterface[]>([]);

  // Función para obtener el rol y mostrarlo como badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return <Badge className="bg-purple-100 text-purple-800">Administrador</Badge>;
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

  // Función para obtener el estado y mostrarlo como badge
  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge className="bg-green-100 text-green-800">Activo</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>
    );
  };

  // Función para crear un nuevo usuario
  const handleCreateUser = async () => {
    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Nombre: newUserEmail,
          Apellido: "",
          Correo: newUserEmail,
          Rol: newUserRole,
          Estado: true, // Estado activo por defecto
          Contraseña: "defaultPassword", // Contraseña predeterminada, deberías cambiarla
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Usuario ${newUserEmail} creado correctamente`);
        setNewUserEmail(""); // Limpiar campos
        setNewUserRole(""); 
        setIsDialogOpen(false); // Cerrar modal
      } else {
        throw new Error('Error al crear usuario');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Función para actualizar usuario
  const handleOnUpdateUser = async (user: Partial<UserInterface>) => {
    const params = new URLSearchParams({ id: String(user.idUsuarios) });

    const response = await fetch(`/api/usuarios?${params.toString()}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Nombre: user.Nombre,
        Apellido: user.Apellido,
        Correo: user.Correo,
        Rol: user.Rol,
        Estado: user.Estado,
        Contraseña: user.Contraseña,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      toast.error(errorText || "Error al actualizar usuario");
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    toast.success("Usuario actualizado correctamente");
    return await response.json();
  };

  // Función para eliminar usuario
  const deleteUser = async (id: number): Promise<void> => {
    if (!id || isNaN(id)) {
      toast.error("ID de usuario inválido");
      return;
    }

    const url = `/api/usuarios?id=${id}`;

    try {
      const res = await fetch(url, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }

      const json = await res.json();
      toast.success(json.message || "Usuario eliminado correctamente");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Ocurrió un error desconocido");
      }
    }
  };

  // Filtrado de usuarios basado en búsqueda
  useEffect(() => {
    if (serachValue && Array.isArray(data)) {
      const filteredDataVal = data.filter(item => 
        item.Nombre.toLowerCase().includes(serachValue.toLowerCase()) || 
        item.Correo.toLowerCase().includes(serachValue.toLowerCase())
      );
      setFilteredData(filteredDataVal);
    } else if (Array.isArray(data)) {
      setFilteredData(data);
    }
  }, [serachValue, data]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestión de Usuarios</CardTitle>
              <CardDescription>Administra las cuentas de redactores y supervisores</CardDescription>
            </div>
            <div className="flex gap-4">
              <FilterSearchBar
                searchValue={serachValue}
                onSearchChange={setSearchValue}
                filterBy={""}
                onFilterByChange={() => {}}
                filterValue={""}
                onFilterValueChange={() => {}}
                availableFields={[{ label: "Categoría", value: "category" }, { label: "Estado", value: "status" }, { label: "Fecha", value: "createdAt" }]}
                getFilterValues={() => []}
              />
              <NuevoUsuariosDialog initialUsuarios={[]} />
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
                  <TableCell colSpan={6} className="text-center flex justify-center">
                    <Spinner />
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((user) => (
                  <TableRow key={user.idUsuarios}>
                    <TableCell className="font-medium">{user.Nombre}</TableCell>
                    <TableCell>{user.Correo}</TableCell>
                    <TableCell>{getRoleBadge(user.Rol)}</TableCell>
                    <TableCell>{getStatusBadge(Boolean(user.Estado))}</TableCell>
                    <TableCell>{new Date(user.FechaCreacion).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user) && setIsDialogUserOpen(true)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user) && setIsDeleteOpen(true)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
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
