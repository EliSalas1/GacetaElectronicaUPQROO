"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import { LogOut, LayoutDashboard } from "lucide-react";

export default function Header() {
  // Simulación de login (reemplazar con AuthContext en tu app real)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const user = {
    name: "Steph",
    email: "steph@test.com",
    image: "https://via.placeholder.com/150",
    role: "Administrador",
  };

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <header className="bg-[#FF6400] text-white px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png" alt="Logo"
            width={32} height={32}
            className="rounded-full"
          />
          <span className="font-bold text-lg">Gaceta UPQROO</span>
        </Link>

        {/* NAVEGACIÓN */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="hover:text-orange-200 transition-colors">
            Inicio
          </Link>

          {/* MENÚ DE CATEGORÍAS */}
          <div className="relative group">
            <span className="cursor-pointer hover:text-orange-200 transition-colors">
              Categorías
            </span>
            <div
              className="absolute left-0 mt-2 w-52 bg-white rounded-md shadow-lg
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50"
            >
              {[
                "Ciencia y Tecnología",
                "Humanidades",
                "Social y política",
                "Logros",
              ].map((cat) => (
                <Link
                  key={cat}
                  href="/categorias"
                  className="block px-4 py-2 text-black hover:bg-orange-100 hover:pl-6 transition-all"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/crear-articulo"
            className="hover:text-orange-200 transition-colors"
          >
            Guía para artículos
          </Link>

          {/* BOTÓN O DROPDOWN */}
          {!isLoggedIn ? (
            <button
              onClick={handleLogin}
              className="bg-[#FF6400] border border-white text-white hover:bg-white hover:text-[#FF6400]
                transition-colors px-4 py-2 rounded text-sm"
            >
              Iniciar Sesión
            </button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="h-8 w-8 rounded-full border border-white hover:bg-white hover:text-[#FF6400]
                    transition-colors flex items-center justify-center"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>
                      {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(user.role === "Administrador" ||
                  user.role === "Supervisor" ||
                  user.role === "Redactor") && (
                  <DropdownMenuItem asChild>
                    <Link href="/panel" className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Panel de {user.role}</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* BOTÓN HAMBURGUESA MOVIL */}
        <button className="md:hidden">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
