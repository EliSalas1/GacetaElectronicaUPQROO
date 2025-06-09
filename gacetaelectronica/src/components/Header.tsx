export default function Header() {
  return (
    <header className="bg-violet-700 text-white p-4 shadow-md">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Gaceta Electrónica UPQROO</h1>
        <nav className="space-x-4">
          <a href="/public" className="hover:underline">Inicio</a>
          <a href="/public/categorias" className="hover:underline">Categorías</a>
          <a href="/public/guia" className="hover:underline">Guía</a>
          <a href="/public/login" className="hover:underline">Iniciar sesión</a>
        </nav>
      </div>
    </header>
  );
}
