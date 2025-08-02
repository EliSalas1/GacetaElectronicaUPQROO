export default function About() {
  return (
    <section className="relative py-10 bg-gray-900 text-white" style={{
      backgroundImage: "url('/principal.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Acerca de Nosotros</h2>
        <p className="text-base leading-relaxed text-gray-200">
          La Gaceta de la Universidad Politécnica de Quintana Roo es un espacio informativo dedicado a difundir las actividades, logros y proyectos de nuestra comunidad universitaria. No dudes en compartir tus conocimientos.
        </p>
      </div>
    </section>
  );
}
