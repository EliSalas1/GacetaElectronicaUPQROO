import Image from "next/image";
"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredNews = [
    {
      id: 1,
      category: "Ciencia y Tecnología",
      categoryColor: "bg-green-100 text-green-800",
      title: "Descubrimiento revolucionario en biotecnología marina",
      description:
        "Equipo de investigadores desarrolla innovador método para tratamiento de enfermedades genéticas usando organismos marinos.",
      author: "Dr. María González",
      date: "12/01/2024",
      href: "#noticia-1",
    },
    {
      id: 2,
      category: "Humanidades",
      categoryColor: "bg-purple-100 text-purple-800",
      title: "Festival Internacional de Danza Contemporánea 2024",
      description:
        "La universidad será sede del festival más importante de danza contemporánea de la región, con artistas de 15 países.",
      author: "Ana Rodríguez",
      date: "10/01/2024",
      href: "#noticia-2",
    },
    {
      id: 3,
      category: "Logros",
      categoryColor: "bg-yellow-100 text-yellow-800",
      title: "Torneo Interuniversitario de Fútbol Copa Universitaria",
      description:
        "Nuestro equipo universitario se prepara para competir en el campeonato más importante del año académico.",
      author: "Equipo de Deportes",
      date: "08/01/2024",
      href: "#noticia-3",
    },
    {
      id: 4,
      category: "Social y político",
      categoryColor: "bg-green-100 text-green-800",
      title: "Proyecto Campus Verde: Energía Solar y Sostenibilidad",
      description:
        "Iniciativa universitaria para implementar sistemas de energía sostenible y programas de reciclaje integral en todo el campus.",
      author: "Comité Verde Estudiantil",
      date: "05/01/2024",
      href: "#noticia-4",
    },
  ];

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % featuredNews.length),
      7000
    );
    return () => clearInterval(interval);
  }, [featuredNews.length]);

  const goToSlide = (index: number) => setCurrentSlide(index);

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-2">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Actividades Destacadas
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto text-sm">
              Descubre los eventos y noticias más importantes de nuestra
              universidad
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative overflow-hidden">
              <div className="bg-white rounded-md shadow-sm overflow-hidden">
                <div
                  className="md:flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {featuredNews.map((news) => (
                    <div key={news.id} className="w-full flex-shrink-0 md:flex">
                      <div className="md:w-1/2 p-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs mb-2 ${news.categoryColor}`}
                        >
                          {news.category}
                        </span>
                        <h3 className="text-lg font-semibold mb-2">
                          {news.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {news.description}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>A. {news.author}</span>
                          <span className="mx-1">•</span>
                          <span>{news.date}</span>
                        </div>
                        <a
                          href={news.href}
                          className="inline-block mt-3 bg-red-800 hover:bg-red-900 text-white px-3 py-1.5 rounded text-sm"
                        >
                          Leer más
                        </a>
                      </div>
                      <div className="md:w-1/2 bg-gray-200 min-h-[250px] flex items-center justify-center">
                        <div className="w-14 h-14 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Indicadores */}
            <div className="flex justify-center mt-4 space-x-1">
              {featuredNews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "bg-orange-500 scale-105"
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
                  aria-label={`Ir a la noticia ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative py-10 bg-gray-900 text-white"
        style={{
          backgroundImage: "url('/placeholder.svg?height=400&width=1200')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Acerca de Nosotros</h2>
          <p className="text-base leading-relaxed text-gray-200">
            La Gaceta de la Universidad Politécnica de Quintana Roo es un
            espacio informativo dedicado a difundir las actividades, logros y
            proyectos de nuestra comunidad universitaria. Buscamos fortalecer la
            identidad institucional y mantener informados a estudiantes,
            docentes y personal sobre el quehacer académico, científico,
            cultural de nuestra universidad.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
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

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* News Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Últimas Noticias</h2>
                <a
                  href="#noticias"
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Ver todas →
                </a>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* News Cards */}
                {[
                  {
                    category: "Ciencia y Tecnología",
                    categoryColor: "bg-blue-100 text-blue-800",
                    title:
                      "Descubrimiento revolucionario en biotecnología marina",
                    description:
                      "Equipo de investigadores desarrolla innovador método para tratamiento de enfermedades genéticas usando organismos marinos.",
                    author: "Dr. María González",
                    tags: ["Artículo de difusión", "Logro", "Nota social"],
                    href: "#noticia-completa-1",
                  },
                  {
                    category: "Humanidades",
                    categoryColor: "bg-purple-100 text-purple-800",
                    title: "Festival Internacional de Danza Contemporánea 2024",
                    description:
                      "La universidad será sede del festival más importante de danza contemporánea de la región. Se espera interes de otras instituciones en participar.",
                    author: "Ana Rodríguez",
                    tags: ["Arte", "Artículo académico"],
                    href: "#noticia-completa-2",
                  },
                  {
                    category: "Logros",
                    categoryColor: "bg-yellow-100 text-yellow-800",
                    title:
                      "Torneo Interuniversitario de Fútbol Copa Universitaria",
                    description:
                      "Nuestro equipo universitario se prepara para competir en el campeonato más importante del año.",
                    author: "Equipo Deportes de Deportes",
                    tags: ["Logro", "Artículo académico"],
                    href: "#noticia-completa-3",
                  },
                  {
                    category: "Social y político",
                    categoryColor: "bg-green-100 text-green-800",
                    title:
                      "Proyecto Campus Verde: Energía Solar y Sostenibilidad",
                    description:
                      "Iniciativa universitaria para implementar sistemas de energía sostenible y programas de reciclaje integral.",
                    author: "Comité Verde Estudiantil",
                    tags: ["Nota social"],
                    href: "#noticia-completa-4",
                  },
                ].map((news, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <div className="w-12 h-12 bg-gray-400 rounded"></div>
                    </div>
                    <div className="p-6">
                      <span
                        className={`inline-block ${news.categoryColor} text-xs px-2 py-1 rounded-full mb-3`}
                      >
                        {news.category}
                      </span>
                      <h3 className="font-bold text-lg mb-2">{news.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {news.description}
                      </p>
                      <div className="text-xs text-gray-500 mb-4">
                        <span>A. {news.author}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {news.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="border border-gray-300 rounded px-2 py-1 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <a
                        href={news.href}
                        className="block w-full bg-red-800 hover:bg-red-900 text-white py-2 rounded text-center"
                      >
                        Leer artículo completo →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Events Sidebar ejemplos, es necesario que sea con id*/}
            <div>
              <h2 className="text-2xl font-bold mb-6">Próximos Eventos</h2>
              <div className="space-y-6">
                {[
                  {
                    title: "Feria de Empleo Universitario",
                    date: "15/01/2024",
                    time: "09:00 AM",
                    location: "Auditorio Principal",
                    description:
                      "Más de 50 empresas buscan talento universitario.",
                    href: "#evento-1",
                  },
                  {
                    title: "Simposio de Investigación",
                    date: "20/01/2024",
                    time: "14:00 PM",
                    location: "Centro de Convenciones",
                    description:
                      "Presentación de proyectos de investigación estudiantil.",
                    href: "#evento-2",
                  },
                  {
                    title: "Torneo Deportivo Interfacultades",
                    date: "25/01/2024",
                    time: "08:00 AM",
                    location: "Complejo Deportivo",
                    description:
                      "Competencias en múltiples disciplinas deportivas.",
                    href: "#evento-3",
                  },
                  {
                    title: "Conferencia de Emprendimiento",
                    date: "10/02/2024",
                    time: "16:00 PM",
                    location: "Sala de Conferencias",
                    description:
                      "Historia de éxito de egresados emprendedores.",
                    href: "#evento-4",
                  },
                ].map((event, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-4"
                  >
                    <h3 className="font-bold mb-2">{event.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <svg
                        className="w-4 h-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <svg
                        className="w-4 h-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <svg
                        className="w-4 h-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {event.location}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {event.description}
                    </p>
                    <a
                      href={event.href}
                      className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                    >
                      Más información
                    </a>
                  </div>
                ))}
                <a
                  href="#eventos"
                  className="block text-orange-500 hover:text-orange-600 w-full text-center font-medium"
                >
                  Ver todos →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Nuestros Logros</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: (
                  <svg
                    className="w-6 h-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                ),
                title: "Premio Nacional de Comunicación Universitaria",
                description:
                  "Reconocimiento por excelencia en comunicación institucional 2023",
                year: "2023",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                ),
                title: "Alcance Internacional",
                description:
                  "Más de 50,000 lectores mensuales de 25 países diferentes",
                year: "2024",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                ),
                title: "500+ Artículos Publicados",
                description:
                  "Amplio archivo de investigaciones, noticias y eventos universitarios",
                year: "2024",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ),
                title: "Red de Colaboradores",
                description: "Más de 100 redactores y colaboradores activos",
                year: "2024",
              },
            ].map((achievement, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 flex items-center space-x-4 shadow-sm"
              >
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {achievement.description}
                  </p>
                </div>
                <div className="text-orange-600 font-bold text-lg">
                  {achievement.year}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative py-5 text-white" // 🔽 reduje de py-20 a py-10
        style={{
          backgroundImage: "url('/placeholder.svg?height=600&width=1200')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative max-w-5xl mx-auto px-4">
          {" "}
          {/* 🔽 max-w más estrecho */}
          <div className="grid md:grid-cols-2 gap-8">
            {" "}
            {/* 🔽 gap-12 → gap-8 */}
            {/* Bloque 1 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                {" "}
                {/* 🔽 w/h reducidos */}
                <svg
                  className="w-8 h-8 text-orange-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Envíanos tu trabajo</h3>{" "}
              {/* 🔽 text-3xl → text-2xl */}
              <p className="text-base mb-6 text-gray-200 leading-relaxed">
                Si tienes un artículo para compartir con la comunidad UPQROO, no
                dudes en enviarnos tus trabajos. Consulta los términos y
                condiciones en nuestra guía.
              </p>
              <a
                href="#guia-envio"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 text-base font-semibold rounded transition duration-300 hover:scale-105"
              >
                Ver guía
              </a>
            </div>
            {/* Bloque 2 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg
                  className="w-8 h-8 text-orange-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                ¿Quieres ser parte de nuestro equipo?
              </h3>
              <p className="text-base mb-6 text-gray-200 leading-relaxed">
                Buscamos últimos estudiantes, investigadores, fotógrafos y
                colaboradores que quieran contribuir con la comunicación
                universitaria.
              </p>
              <a
                href="#contacto"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 text-base font-semibold rounded transition duration-300 hover:scale-105"
              >
                Contáctanos
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}