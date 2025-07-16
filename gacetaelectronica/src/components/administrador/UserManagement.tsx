"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"; 
import { es } from "date-fns/locale"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import EditUserDialog from "./EditUserDialog"
import { UserInterface } from "@/entities/user"
import DeleteUserDialog from "./DeleteUserDialog"
import FilterSearchBar from "../FilterSearchBar"
import { useFetch } from "@/hooks/useFetch"
import { Spinner } from "../Spinner"

const formatDate = (dateString: string) => {
  const date = new Date(dateString); // Convertimos la cadena a un objeto Date
  return format(date, "hh:mm a dd/MM/yyyy", { locale: es }); // Formato como en la imagen
};

export default function UserManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDialogUserOpen, setIsDialogUserOpen] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState("")
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const [serachValue, setSearchValue] = useState<string>("")
  const {data, loading} = useFetch<UserInterface[]>('api/usuarios')
  const [filteredData, setFilteredData] = useState<UserInterface[]>([])

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return <Badge className="bg-purple-100 text-purple-800">Administrador</Badge>
      case "Autor":
        return <Badge className="bg-blue-100 text-blue-800">Autor</Badge>
      case "Revisor":
        return <Badge className="bg-green-100 text-green-800">Revisor</Badge>
      case "Usuario":
        return <Badge className="bg-green-100 text-green-800">Usuario</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>
      case 0:
        return <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const handleCreateUser = () => {
    toast.message("Usuario creado", {
      description: `Usuario ${newUserEmail} creado con rol ${newUserRole}`,
    })
    setNewUserEmail("")
    setNewUserRole("")
    setIsDialogOpen(false)
  }

  async function deleteUser(id: number): Promise<void> {
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
  }

  const handleEditClick = (usuario: UserInterface) => {
    setSelectedUser(usuario)
    setIsDialogUserOpen(true)
  }

  const handleDeleteClick = (usuario: UserInterface) => {
    console.log(isDialogUserOpen);
    setSelectedUser(usuario)
    setIsDeleteOpen(true)
  }

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
  }

  useEffect(() => {
    if(serachValue && Array.isArray(data)) {
      const filteredDataVal = data.filter(item => item.Nombre.toLowerCase().includes(serachValue.toLowerCase()) || item.Correo.toLowerCase().includes(serachValue.toLowerCase()));
      setFilteredData(filteredDataVal);
    } else if(Array.isArray(data)) {
      setFilteredData(data)
    }
  }, [serachValue, data])

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
                availableFields={[
                  { label: "Categoría", value: "category" },
                  { label: "Estado", value: "status" },
                  { label: "Fecha", value: "createdAt" }
                ]}
                getFilterValues={(field) => []}
              />
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Usuario
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                    <DialogDescription>Agrega un nuevo usuario al sistema</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="usuario@universidad.edu"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="w-full" htmlFor="role">Rol</Label>
                      <Select value={newUserRole} onValueChange={setNewUserRole}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="redactor">Redactor</SelectItem>
                          <SelectItem value="supervisor">Supervisor</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleCreateUser} disabled={!newUserEmail || !newUserRole} className="w-full">
                      Crear Usuario
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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
                {loading ? <TableRow><TableCell colSpan={6} className="text-center flex justify-center"><Spinner/></TableCell></TableRow> : ""}
                {filteredData.map((user) => (
                  <TableRow key={user.idUsuarios}>
                    <TableCell className="font-medium">{user.Nombre}</TableCell>
                    <TableCell>{user.Correo}</TableCell>
                    <TableCell>{getRoleBadge(user.Rol)}</TableCell>
                    <TableCell>{getStatusBadge(Number(user.Estado))}</TableCell>
                    <TableCell>{formatDate(user.FechaCreacion)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditClick(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(user)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedUser && (
        <>
          <EditUserDialog
            isOpen={isDialogUserOpen}
            setIsOpen={(open) => {
              setIsDialogUserOpen(open)
              if(!open) setSelectedUser(null)
            }}
            usuario={selectedUser}
            onSave={handleOnUpdateUser}
          />
          <DeleteUserDialog
            isOpen={isDeleteOpen}
            setIsOpen={(open) => {
              setIsDeleteOpen(open)
              if (!open) setSelectedUser(null)
            }}
            usuario={selectedUser}
            onConfirm={deleteUser}
          />
        </>
      )}
    </>
  )
}
