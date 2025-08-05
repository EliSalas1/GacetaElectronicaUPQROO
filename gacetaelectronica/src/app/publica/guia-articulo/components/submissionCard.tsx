
export default function SubmissionCard() {
  return (
    <section className="bg-white border rounded-xl p-6 mt-6">
      <h2 className="text-lg font-semibold text-left text-red-800 mb-4 flex items-center gap-2">
        <span className="inline-block bg-blue-100 text-blue-600 rounded-full w-6 h-6 text-sm flex items-center justify-center font-bold">
          5
        </span>
        Proceso de envío y evaluación
      </h2>

      <ol className="list-decimal list-inside text-gray-700 space-y-2 text-sm">
        <li>
          Enviar el texto a <strong>gaceta@upqroo.edu.mx</strong> con el asunto: <em>“Tipo de contribución – Título”</em> (ej: <em>“Relato corto – La ciudad de los espejos”</em>)
        </li>
        <li>
          <strong>Revisión editorial:</strong> El equipo evaluará pertinencia, calidad y ajuste a las normas
        </li>
        <li>
          <strong>Retroalimentación:</strong> En caso de correcciones, se notificará al autor
        </li>
        <li>
          <strong>Publicación:</strong> Los seleccionados se publicarán en la edición impresa o digital, con crédito al autor
        </li>
      </ol>
    </section>
  );
}
