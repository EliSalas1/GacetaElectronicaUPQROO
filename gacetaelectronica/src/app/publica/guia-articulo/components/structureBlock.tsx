export default function StructureBlock() {
  return (
    <div className="space-y-4">
      <div>
        <p className="font-bold">A. Artículos científicos</p>
        <ul className="list-disc pl-5">
          <li><b>Título:</b> Claro y descriptivo</li>
          <li><b>Resumen:</b> 100–150 palabras (objetivo, metodología, conclusiones)</li>
          <li><b>Introducción:</b> Contexto y relevancia</li>
          <li><b>Desarrollo:</b> Métodos, resultados y discusión</li>
          <li><b>Conclusiones:</b> Breves y sustentadas</li>
          <li><b>Referencias:</b> Normas APA u otras según el área</li>
        </ul>
      </div>

      <div>
        <p className="font-bold text-green-700">B. Artículos de divulgación</p>
        <ul className="list-disc pl-5">
          <li><b>Título:</b> Atractivo y sencillo</li>
          <li><b>Introducción:</b> Enganchar al lector con una pregunta o anécdota</li>
          <li><b>Desarrollo:</b> Explicar conceptos con ejemplos y lenguaje accesible</li>
          <li><b>Conclusión:</b> Reflexión final o llamado a la acción</li>
        </ul>
      </div>

      <div>
        <p className="font-bold text-red-600">C. Notas periodísticas/sociales</p>
        <ul className="list-disc pl-5">
          <li><b>Lead (entrada):</b> Responder qué, quién, cuándo, dónde y por qué en el primer párrafo</li>
          <li><b>Cuerpo:</b> Detalles, testimonios o datos relevantes</li>
          <li><b>Fotos:</b> Incluir pies de foto descriptivos (opcional)</li>
        </ul>
      </div>

      <div>
        <p className="font-bold text-indigo-700">D. Relatos cortos o poesía</p>
        <ul className="list-disc pl-5">
          <li><b>Título:</b> Sugerente o simbólico</li>
          <li>Estructura libre, pero con cohesión narrativa</li>
          <li>Se valora originalidad y estilo</li>
        </ul>
      </div>

      <div>
        <p className="font-bold text-pink-700">E. Historietas/arte</p>
        <ul className="list-disc pl-5">
          <li><b>Guión o descripción:</b> Incluir una breve sinopsis si el arte es abstracto</li>
          <li><b>Formato visual:</b> Legible en tamaño gaceta (consultar medidas específicas)</li>
        </ul>
      </div>
    </div>
  )
}
