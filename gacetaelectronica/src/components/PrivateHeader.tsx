"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, LayoutDashboard } from "lucide-react"

export default function PrivateHeader() {
  const { data: session } = useSession()

  const user = session?.user
  const role = user?.role || "Usuario"

  return (
    <header className="bg-[#FF6400] text-white shadow-md sticky top-0 z-50 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Nombre + rol */}
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold whitespace-nowrap">Gaceta Electrónica</h2>
          <span className="px-2 py-1 text-xs font-bold bg-white text-[#FF6400] rounded-md capitalize">
            {role}
          </span>
        </div>

        {/* Avatar + Dropdown */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 group transition-all duration-200 rounded-full border-2 border-white p-1 hover:bg-white">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={"/placeholder.svg"}
                    alt={user.name || user.email || "U"}
                  />
                  <AvatarFallback className="bg-white text-[#FF6400]">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 bg-white text-black" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold text-[#FF6400]">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link
                  href="/"
                  className="flex items-center gap-2 hover:text-[#FF6400]"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Inicio</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/publica/login" })}
                className="text-red-600 hover:text-red-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
