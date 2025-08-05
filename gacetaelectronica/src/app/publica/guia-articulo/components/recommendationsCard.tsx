
export default function RecommendationsCard() {
  return (
    <section className="bg-white border rounded-xl p-6 mt-6">
      <h2 className="text-lg font-semibold text-left text-red-800 mb-4 flex items-center gap-2">
        Recomendaciones adicionales
      </h2>

      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-gray-700 text-sm">
        <p><strong>Revisión:</strong> Evitar errores ortográficos y de sintaxis</p>
        <p><strong>Originalidad:</strong> Los textos deben ser inéditos y de autoría propia</p>
        <p><strong>Tono:</strong> 
          <br />• Científico/divulgación: Rigor pero claridad
          <br />• Creativos: Libertad expresiva, pero respetuosa
        </p>
        <p><strong>Imágenes:</strong> Enviar con permisos de uso y calidad mínima de 300 DPI</p>
      </div>
    </section>
  );
}
