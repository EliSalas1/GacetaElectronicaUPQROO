'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';

type SearchResult = {
  tipo: 'articulo' | 'autor' | 'evento';
  id: number;
  titulo: string;
  metadata?: string;
};

export default function SearchBar() {
  const [termino, setTermino] = useState('');
  const [resultados, setResultados] = useState<SearchResult[]>([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [debouncedTermino] = useDebounce(termino, 500);
  const router = useRouter();

  useEffect(() => {
    if (debouncedTermino.trim()) {
      fetch(`/api/buscador?q=${encodeURIComponent(debouncedTermino)}`)
        .then(res => res.json())
        .then(data => {
          setResultados(data);
          setMostrarResultados(true);
        })
        .catch(console.error);
    } else {
      setResultados([]);
      setMostrarResultados(false);
    }
  }, [debouncedTermino]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (termino.trim()) {
      router.push(`/busqueda?q=${encodeURIComponent(termino)}`);
      setMostrarResultados(false);
    }
  };

  const handleResultClick = (resultado: SearchResult) => {
    router.push(`/${resultado.tipo}/${resultado.id}`);
    setTermino('');
    setMostrarResultados(false);
  };

  return (
    <section className="py-8 relative">
      <div className="max-w-7xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar artículos, eventos, autores..."
              className="w-full pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={termino}
              onChange={(e) => setTermino(e.target.value)}
              onFocus={() => termino && setMostrarResultados(true)}
              onBlur={() => setTimeout(() => setMostrarResultados(false), 200)}
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            {mostrarResultados && resultados.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-auto">
                {resultados.map((item) => (
                  <div
                    key={`${item.tipo}-${item.id}`}
                    className="p-3 hover:bg-gray-50 cursor-pointer"
                    onMouseDown={() => handleResultClick(item)}
                  >
                    <div className="flex items-center">
                      <span className={`px-2 py-1 text-xs rounded-full mr-2 ${
                        item.tipo === 'articulo' ? 'bg-blue-100 text-blue-800' :
                        item.tipo === 'autor' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {item.tipo}
                      </span>
                      <div>
                        <h4 className="font-medium">{item.titulo}</h4>
                        {item.metadata && (
                          <p className="text-xs text-gray-500">{item.metadata}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md"
          >
            Buscar
          </button>
        </form>
      </div>
    </section>
  );
}