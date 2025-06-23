"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User } from "lucide-react"
import { HEADER_OPTIONS_BY_ROLE, ROLE_NAME } from "@/constants/header"

export default function PrivateHeader() {
  // La información de ambas constantes deberán venir del usuario logeado
  // TODO: Hay que hacer un contexto globalr useContext() que obtendrá la sesión del usuario y la mantendrá.
  // El contexto se utilizará aquí para obtener la información del usuario.
  const user = {
    name: "Administrador",
    email: "test@test.com",
    image: "https://via.placeholder.com/150",
  }

  const role = "admin" // Este valor debería venir del contexto global o de la sesión del usuario

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">Gaceta Electrónica</h2>
          <span className="px-2 py-1 text-xs font-bold bg-[#711919] text-[#ffffff] rounded-full">{ROLE_NAME[role]}</span>
        </div>

        <div className="flex items-center gap-4">
          <div>
            {HEADER_OPTIONS_BY_ROLE[role]?.map((option, index) => ( // Aquí se renderizan las opciones del header según el rol del usuario
              <Button
                key={index}
                variant="ghost"
                className="text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => window.location
                  .assign(option.href)}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image || ""} alt={user.name || ""} />
                  <AvatarFallback>{user.name?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Salir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
