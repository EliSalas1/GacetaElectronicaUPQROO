import { FC } from "react"
import SimpleCard from "./simpleCard"
import ContributionsCard from "./contributionsCard"
import InvitationCard from "./invitationCard"
import RecommendationsCard from "./recommendationsCard"
import SubmissionCard from "./submissionCard"
import StructureBlock from "./structureBlock"

export const GuiaArticulosContainer: FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 mt-12 text-left">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-1">
        Guía de Redacción para Autores
      </h1>
      <p className="text-sm text-center text-gray-600 mb-8">
        Gaceta Universitaria J-UP
      </p>

      <SimpleCard
        title="Bienvenidos a la Gaceta Universitaria"
        text={
          <p>
            Un espacio dedicado a la difusión del conocimiento, la creatividad y la vida académica y cultural de nuestra comunidad. A continuación, presentamos una guía para ayudar a los autores a preparar sus contribuciones de acuerdo con los formatos y estilos requeridos.
          </p>
        }
      />

      <ContributionsCard />

      <SimpleCard
        title="Pautas generales de redacción"
        text={
          <>
            <p className="font-semibold">Extensión:</p>
            <ul className="list-disc pl-5 mb-4">
              <li><b>Artículos (científicos/divulgación)</b>: 800–1500 palabras</li>
              <li><b>Notas periodísticas/sociales</b>: 300–600 palabras</li>
              <li><b>Relatos cortos</b>: 500–1200 palabras</li>
              <li><b>Historietas/arte</b>: Máximo 2 páginas (formato a consultar con el equipo editorial)</li>
            </ul>

            <p className="font-semibold">Formato:</p>
            <ul className="list-disc pl-5 mb-4">
              <li>Documento en <b>Word</b> o <b>Google Docs</b>, fuente Times New Roman (12 pt) o Arial (11 pt), interlineado 1.5</li>
              <li>Para arte o cómics, enviar archivos en alta resolución (JPEG, PNG o PDF)</li>
            </ul>

            <p className="font-semibold">Idioma:</p>
            <p>
              Español claro y preciso. En caso de textos académicos, seguir normas APA o IEEE (según el área).
            </p>
          </>
        }
      />

      <SimpleCard
        title="Estructura por tipo de texto"
        text={
          <>
            <StructureBlock/>
          </>
        }
      />

      <RecommendationsCard />

      <SubmissionCard />
        <div style={{ marginTop: "32px" }}>
          <InvitationCard />
        </div>
    </div>
  )
}
