export default function SearchBar() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar artículos, eventos, investigaciones..."
              className="w-full pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <a
            href="#busqueda"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md"
          >
            Todas
          </a>
        </div>
      </div>
    </section>
  );
}
