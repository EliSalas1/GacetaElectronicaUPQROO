import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#FF6400] text-white text-sm">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-12 text-center md:text-left border-t border-orange-400">
        <div className="space-y-2">
          <h4 className="font-bold text-base">Gaceta Universitaria</h4>
          <p className="text-orange-100 leading-relaxed">
            Portal oficial de noticias, eventos e investigaciones de nuestra universidad. Gaceta UPQROO - scientia, tripalium et virtus.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-base">Categorías</h4>
          <ul className="space-y-1 text-orange-100">
            <li><Link href="/categorias/investigacion" className="hover:text-white">Ciencia y Tecnología</Link></li>
            <li><Link href="/categorias/eventos" className="hover:text-white">Humanidades</Link></li>
            <li><Link href="/categorias/convocatorias" className="hover:text-white">Social y política</Link></li>
            <li><Link href="/categorias/proyectos" className="hover:text-white">Logros</Link></li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-base">Enlaces útiles</h4>
          <ul className="space-y-1 text-orange-100">
            <li><Link href="/acerca-de" className="hover:text-white">Acerca de</Link></li>
            <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
            <li><Link href="/privacidad" className="hover:text-white">Política de privacidad</Link></li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-base">Contacto</h4>
          <ul className="space-y-1 text-orange-100">
            <li>UPQROO</li>
            <li>gaceta@upqroo.edu.mx</li>
            <li>9982831859</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-orange-100 text-sm py-4 border-t border-[#FF6400]">
        © 2025 Gaceta Universitaria. Todos los derechos reservados.
      </div>
    </footer>
  );
}
