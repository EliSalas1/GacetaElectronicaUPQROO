"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import HomeCarousel from "@/components/HomeComponents/HomeCarousel";
import About from "@/components/HomeComponents/About";
// import SearchBar from "@/components/HomeComponents/SearchBar";
import NoticesList from "@/components/HomeComponents/NoticesList";
import Events from "@/components/HomeComponents/Events";
import Contact from "@/components/HomeComponents/Contact";
import LogrosUs from "@/components/HomeComponents/Logros";
// import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Encabezado principal del sitio */}
      <Header />

      {/* Sección: Carrusel de actividades destacadas */}
      <section className="bg-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-2 text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Actividades Destacadas
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-sm">
            Descubre los eventos y noticias más importantes de nuestra
            universidad
          </p>
        </div>
        <HomeCarousel />
      </section>

      {/* Sección informativa: Acerca de + Búsqueda */}
      <About />

      {/* <SearchBar /> */}

      {/* Sección combinada: Noticias y Eventos */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            {/* Noticias (ocupan 2/3 de la sección) */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                  Últimas Noticias
                </h2>

                {/* Botón opcional para ver todas las noticias */}
                {/*
                <a
                  href="#noticias"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-800 hover:bg-gray-100 transition"
                >
                  Ver todas
                  <ArrowRight className="ml-1 w-4 h-4" />
                </a>
                */}
              </div>
              <NoticesList />
            </div>

            {/* Barra lateral: Eventos próximos */}
            <aside className="space-y-6">
              <Events />
            </aside>
          </div>
        </div>
      </section>

      {/* Sección de logros institucionales */}
      <LogrosUs />

      {/* Sección de contacto y colaboración */}
      <Contact />

      {/* Pie de página */}
      <Footer />
    </div>
  );
}
