"use client";
import { Album, Mail } from "lucide-react";


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
      <div className="relative mx-auto bg-black/70 px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left">
      
      {/* Bloque 1 */}
      <div className="flex flex-col justify-center items-center px-10 space-y-4">
        <div>
          <h3 className="text-xl text-center font-bold mb-3 text-white">Envíanos tu trabajo</h3>
          <p className="text-sm text-center mb-6 text-gray-300 leading-relaxed">
            Si tienes un artículo propio para compartir con la comunidad UPQROO, no dudes en enviarnos tu trabajo. Consulta los términos y condiciones en nuestra guía.
          </p>
        </div>
        <a
          href="#guia-envio"
          className="inline-flex items-center justify-center bg-[#111] hover:bg-[#222] text-white px-4 py-2 rounded transition text-xs font-medium w-fit mx-auto md:mx-0"
        >
          <Album className="h-4 w-4 mr-2" />
          Ver guía
        </a>
      </div>

      {/* Bloque 2 */}
      <div className="flex flex-col justify-center items-center px-10 space-y-4">
        <div>
          <h3 className="text-xl text-center font-bold mb-3 text-white">¿Quieres ser parte de nuestro equipo?</h3>
          <p className="text-sm text-center mb-6 text-gray-300 leading-relaxed">
            Buscamos redactores, fotógrafos y colaboradores que deseen contribuir con la comunicación universitaria.
          </p>
        </div>
        <a
          href="/registro"
          className="inline-flex items-center justify-center bg-[#111] hover:bg-[#222] text-white px-4 py-2 rounded transition text-xs font-medium w-fit mx-auto md:mx-0"
        >
          <Mail className="h-4 w-4 mr-2" />
          Registrarse
        </a>
      </div>
    </div>
    </section>
  );
}
