import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-orange-500 text-white px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-orange-500 font-bold text-sm">J</span>
          </div>
          <span className="font-bold text-lg">J-UP</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="hover:text-orange-200 transition-colors">
            Inicio
          </Link>

          {/* Categorías con submenú invisible */}
          <div className="relative group">
            <span className="cursor-pointer hover:text-orange-200 transition-colors">
              Categorías
            </span>
            <div className="absolute left-0 mt-2 w-52 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <Link
                href="/categorias"
                className="block px-4 py-2 text-black hover:bg-orange-100 hover:pl-6 transition-all"
              >
                Ciencia y Tecnología
              </Link>
              <Link
                href="/categorias"
                className="block px-4 py-2 text-black hover:bg-orange-100 hover:pl-6 transition-all"
              >
                Humanidades
              </Link>
              <Link
                href="/categorias"
                className="block px-4 py-2 text-black hover:bg-orange-100 hover:pl-6 transition-all"
              >
                Social y política
              </Link>
              <Link
                href="/categorias"
                className="block px-4 py-2 text-black hover:bg-orange-100 hover:pl-6 transition-all"
              >
                Logros
              </Link>
            </div>
          </div>

          <Link
            href="/crear-articulo"
            className="hover:text-orange-200 transition-colors"
          >
            Guía para artículos
          </Link>

          <button className="border border-white text-white hover:bg-white hover:text-orange-500 transition-colors px-4 py-2 rounded text-sm">
            Iniciar Sesión
          </button>
        </nav>

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
