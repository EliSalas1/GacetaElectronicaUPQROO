'use client';

// import FeaturedNotices from '@/components/HomeComponents/FeaturedNotices';
// import AllNotices from '@/components/HomeComponents/AllNotices';

export default function NoticiasApiPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Noticias desde la API</h1>
        <p className="text-gray-600">
          Esta página muestra artículos obtenidos directamente desde la base de datos con imágenes mapeadas
        </p>
      </div>

      <div className="space-y-12">
        {/* Artículos Destacados */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Artículos Destacados</h2>
          {/* <FeaturedNotices /> */}
        </section>

        {/* Todos los Artículos */}
        <section>
          {/* <AllNotices limit={12} /> */}
        </section>
      </div>
    </div>
  );
} 