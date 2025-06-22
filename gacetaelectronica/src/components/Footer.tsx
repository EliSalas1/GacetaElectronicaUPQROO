import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#FF6400] text-white">
      {/* Footer Inferior */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-4 gap-8 text-center md:text-left text-xs border-t border-orange-400">
        <div>
          <h4 className="font-bold mb-2">Gaceta Universitaria</h4>
          <p className="text-orange-100">
            Portal oficial de noticias, eventos e investigaciones de nuestra universidad.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-2">Categorías</h4>
          <ul className="space-y-1 text-orange-100">
            <li><Link href="/categorias/investigacion" className="hover:text-white">Ciencia y Tecnología</Link></li>
            <li><Link href="/categorias/eventos" className="hover:text-white">Humanidades</Link></li>
            <li><Link href="/categorias/convocatorias" className="hover:text-white">Social y política</Link></li>
            <li><Link href="/categorias/proyectos" className="hover:text-white">Logros</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-2">Enlaces útiles</h4>
          <ul className="space-y-1 text-orange-100">
            <li><Link href="/acerca-de" className="hover:text-white">Acerca de</Link></li>
            <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
            <li><Link href="/privacidad" className="hover:text-white">Política de privacidad</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-2">Contacto</h4>
          <ul className="space-y-1 text-orange-100">
            <li>UPQROO</li>
            <li>gaceta@upqroo.edu.mx</li>
            <li>+52 (123) 123-4567</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-orange-100 text-xs py-4 border-t border-[#FF6400]">
        © 2025 Gaceta Universitaria. Todos los derechos reservados.
      </div>
    </footer>
  )
}
