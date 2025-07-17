"use client";
import { Album, Mail, FileText, Users } from "lucide-react";

export default function Contact() {
  return (
    <section
      className="relative text-white"
      style={{
        backgroundImage: "url('/contact.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Fondo oscuro encima */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* BLOQUE 1 */}
        <div className="flex flex-col justify-between px-4 py-6 text-center h-[300px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-[#FF6400] rounded-full p-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold">Envíanos tu trabajo</h3>
            <p className="text-sm text-gray-300 max-w-md mx-auto">
              Si tienes un artículo propio para compartir con la comunidad UPQROO, no dudes en enviarnos tu trabajo. Consulta los términos y condiciones en nuestra guía.
            </p>
          </div>
          <a
            href="#guia-envio"
            className="inline-flex items-center justify-center bg-black hover:bg-neutral-800 text-white px-7 py-3 rounded text-sm transition font-semibold mx-auto"
          >
            <Album className="h-5 w-5 mr-2" />
            Ver guía
          </a>
        </div>

        {/* BLOQUE 2 */}
        <div className="flex flex-col justify-between px-4 py-6 text-center h-[300px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-[#FF6400] rounded-full p-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold">¿Quieres ser parte de nuestro equipo?</h3>
            <p className="text-sm text-gray-300 max-w-md mx-auto">
              Buscamos redactores, fotógrafos y colaboradores que deseen contribuir con la comunicación universitaria.
            </p>
          </div>
          <a
            href="/registro"
            className="inline-flex items-center justify-center bg-black hover:bg-neutral-800 text-white px-7 py-3 rounded text-sm transition font-semibold mx-auto"
          >
            <Mail className="h-5 w-5 mr-2" />
            Registrarse
          </a>
        </div>
      </div>
    </section>
  );
}
