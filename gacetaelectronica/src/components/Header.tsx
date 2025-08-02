"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role,
      }
    : null;

  const handleLogin = () => {
    signIn("google");
  };

  const handleLogout = () => {
    signOut();
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const categories = [
    "Ciencia y Tecnología",
    "Humanidades",
    "Social y política",
    "Logros",
  ];

  return (
    <header className="bg-[#FF6400] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-4 flex-shrink-0">
            <Image
              src="/2UPQROO-logo.png"
              alt="Logo Gaceta UPQROO"
              width={100}
              height={80}
              className="object-contain flex-shrink-0"
              priority
              quality={100}
            />
            <span className="ml-3 font-semibold text-lg sm:text-xl whitespace-nowrap">
              Gaceta UPQROO
            </span>
          </Link>

          {/* NAVEGACIÓN DESKTOP */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className="hover:text-orange-200 transition-colors duration-200 font-medium"
            >
              Inicio
            </Link>

            <div className="relative group">
              <span className="cursor-pointer hover:text-orange-200 transition-colors duration-200 font-medium">
                Categorías
              </span>
              <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      href="/publica/categorias"
                      className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-[#FF6400] hover:pl-6 transition-all duration-200"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

          <Link
            href="/publica/guia-articulo"
            className="hover:text-orange-200 transition-colors"
          >
            Guía para artículos
          </Link>

            {/* AUTH SECTION */}
            {status !== "authenticated" ? (
              <Link
                href="/publica/login"
                className="bg-[#FF6400] border border-white text-white hover:bg-white hover:text-[#FF6400] transition-colors px-4 py-2 rounded text-sm"
              >
                Iniciar Sesión
              </Link>
            ) : (
              user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 group transition-all duration-200 rounded-full border-2 border-white p-1 hover:bg-white">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.image || "/placeholder.svg"}
                          alt={user.name || user.email || "U"}
                        />
                        <AvatarFallback>
                          {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-white text-black"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold text-[#FF6400]">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                      {user.role === "Admin" && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href="/private/administrador" className="flex items-center gap-2 hover:text-[#FF6400]">
                              <LayoutDashboard className="h-4 w-4" />
                              <span>Panel de Admin</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/private/supervisor" className="flex items-center gap-2 hover:text-[#FF6400]">
                              <LayoutDashboard className="h-4 w-4" />
                              <span>Panel de Supervisor</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/private/redactor" className="flex items-center gap-2 hover:text-[#FF6400]">
                              <LayoutDashboard className="h-4 w-4" />
                              <span>Panel de Redactor</span>
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}

                      {user.role === "Revisor" && (
                        <DropdownMenuItem asChild>
                          <Link href="/private/supervisor" className="flex items-center gap-2 hover:text-[#FF6400]">
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Panel de Supervisor</span>
                          </Link>
                        </DropdownMenuItem>
                      )}

                      {user.role === "Autor" && (
                        <DropdownMenuItem asChild>
                          <Link href="/private/redactor" className="flex items-center gap-2 hover:text-[#FF6400]">
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Panel de Redactor</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-700"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            )}
          </nav>

          {/* BOTÓN HAMBURGUESA MÓVIL */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-md hover:bg-orange-500 transition-colors duration-200"
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* MENÚ MÓVIL */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-orange-300">
            <nav className="flex flex-col space-y-2 mt-4">
              <Link
                href="/"
                className="block px-4 py-3 hover:bg-orange-500 rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Inicio
              </Link>

              <div className="px-4 py-2">
                <span className="font-medium text-orange-100 text-sm">
                  Categorías
                </span>
                <div className="mt-2 ml-4 space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      href="/publica/categorias"
                      className="block py-2 text-sm hover:text-orange-200 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/publica/guia-articulo"
                className="block px-4 py-3 hover:bg-orange-500 rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Guía para artículos
              </Link>

              <div className="px-4 pt-4 border-t border-orange-300 mt-4">
                {status !== "authenticated" ? (
                  <Link
                  href="/publica/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full block text-center bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#FF6400] transition-all duration-200 px-4 py-3 rounded-lg font-medium"
                  >
                    Iniciar Sesión
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-4 py-3 bg-orange-500 rounded-md">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.image || "/placeholder.svg"}
                          alt={user?.name || user?.email || "U"}
                        />
                        <AvatarFallback className="bg-white text-[#FF6400]">
                          {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-orange-100">{user?.email}</p>
                      </div>
                    </div>

                    {user?.role === "Admin" && (
                    <>
                    <Link
                      href="/private/administrador"
                      className="flex items-center gap-2 px-4 py-3 hover:bg-orange-500 rounded-md transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Panel de Admin</span>
                    </Link>
                    <Link
                      href="/private/supervisor"
                      className="flex items-center gap-2 px-4 py-3 hover:bg-orange-500 rounded-md transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Panel de Supervisor</span>
                    </Link>
                    <Link
                      href="/private/redactor"
                      className="flex items-center gap-2 px-4 py-3 hover:bg-orange-500 rounded-md transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Panel de Redactor</span>
                    </Link>
                    </>
                  )}

                  {user?.role === "Revisor" && (
                  <Link
                    href="/private/supervisor"
                    className="flex items-center gap-2 px-4 py-3 hover:bg-orange-500 rounded-md transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Panel de Supervisor</span>
                  </Link>
                  )}

                  {user?.role === "Redactor" && (
                  <Link
                  href="/private/redactor"
                  className="flex items-center gap-2 px-4 py-3 hover:bg-orange-500 rounded-md transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                  >
                  <LayoutDashboard className="h-4 w-4" />
                    <span>Panel de Redactor</span>
                  </Link>
                  )}


                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-3 text-red-200 hover:bg-red-500 hover:text-white rounded-md transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
