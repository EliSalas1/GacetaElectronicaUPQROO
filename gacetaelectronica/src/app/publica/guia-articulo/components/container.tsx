import { FC } from "react";
import SimpleCard from "./simpleCard";
import ContributionsCard from "./contributionsCard";
import InvitationCard from "./invitationCard";

export interface GuiaArticulosPropts {} 

// =======================
// Contenedor principal de la guía de artículos
// =======================
export const GuiaArticulosContainer: FC<GuiaArticulosPropts> = ({}) => {
  return (
    // Wrapper centrado y con máximo ancho
    <div
      style={{
        maxWidth: "700px",
        margin: "48px auto 0 auto", // margen superior y centrado horizontal
        padding: "0 16px", // padding lateral para pantallas pequeñas
        textAlign: "center",
      }}
    >
      {/* Título principal */}
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: 700,
          marginBottom: "32px",
        }}
      >
        Guía de Redacción para Autores 
      </h1>

      {/* Cards */}
      <SimpleCard
        title="Bienvenidos a la Gaceta Universitaria"
        text="Un espacio dedicado a la difusión del conocimiento, la creatividad y la vida académica y cultural de nuestra comunidad. A continuación, presentamos una guía para ayudar a los autores a preparar sus contribuciones de acuerdo con los formatos y estilos requeridos."
      />
    
      <ContributionsCard />

      <SimpleCard
        title="Pautas generales de redacción"
        text={
          <div>
            <p style={{ margin: '0 0 4px 0' }}><strong>Extensión:</strong></p>
            <ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: '0 0 16px 0' }}>
                <li>Artículos (científicos/divulgación): 800–1500 palabras</li>
                <li>Notas periodísticas/sociales: 300–600 palabras</li>
                <li>Relatos cortos: 500–1200 palabras</li>
                <li>Historietas/arte: Máximo 2 páginas (formato a consultar con el equipo editorial)</li>
            </ul>

            <p style={{ margin: '0 0 4px 0' }}><strong>Formato:</strong></p>
            <ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: '0 0 16px 0' }}>
                <li>Documento en Word o Google Docs, fuente Times New Roman (12 pt) o Arial (11 pt), interlineado 1.5</li>
                <li>Para arte o cómics, enviar archivos en alta resolución (JPEG, PNG o PDF)</li>
            </ul>

            <p style={{ margin: '0 0 4px 0' }}><strong>Idioma:</strong></p>
            <p style={{ margin: '0' }}>
                Español claro y preciso. En caso de textos académicos, seguir normas APA o IEEE (según el área).
            </p>
          </div>
        }
      />

      <SimpleCard
        title="Estructura por tipo de texto"
        text={
          <div>
            <p style={{ margin: '0 0 4px 0' }}><strong>A. Artículos científicos</strong></p>
            <ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: '0 0 16px 0' }}>
                <li>Título: Claro y descriptivo</li>
                <li>Resumen: 100–150 palabras (objetivo, metodología, conclusiones)</li>
                <li>Introducción: Contexto y relevancia</li>
                <li>Desarrollo: Métodos, resultados y discusión</li>
                <li>Conclusiones: Breves y sustentadas</li>
                <li>Referencias: Normas APA u otras según el área</li>
            </ul>

            <p style={{ margin: '0 0 4px 0' }}><strong>B. Artículos de divulgación</strong></p>
            <ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: '0 0 16px 0' }}>
                <li>Título: Atractivo y sencillo</li>
                <li>Introducción: Enganchar al lector con una pregunta o anécdota</li>
                <li>Desarrollo: Explicar conceptos con ejemplos y lenguaje accesible</li>
                <li>Conclusión: Reflexión final o llamado a la acción</li>
            </ul>

            <p style={{ margin: '0 0 4px 0' }}><strong>C. Notas periodísticas/sociales</strong></p>
            <ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: '0 0 16px 0' }}>
                <li>Lead (entrada): Responder qué, quién, cuándo, dónde y por qué en el primer párrafo</li>
                <li>Cuerpo: Detalles, testimonios o datos relevantes</li>
                <li>Fotos: Incluir pies de foto descriptivos (opcional)</li>
            </ul>
            
            <p style={{ margin: '0 0 4px 0' }}><strong>D. Relatos cortos o poesía</strong></p>
            <ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: '0 0 16px 0' }}>
                <li>Título: Sugerente o simbólico</li>
                <li>Estructura libre, pero con cohesión narrativa</li>
                <li>Se valora originalidad y estilo</li>
            </ul>

            <p style={{ margin: '0 0 4px 0' }}><strong>E. Historietas/arte</strong></p>
            <ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: '0' }}>
                <li>Guión o descripción: Incluir una breve sinopsis si el arte es abstracto</li>
                <li>Formato visual: Legible en tamaño gaceta (consultar medidas específicas)</li>
            </ul>
          </div>
        }
      />
      
      <SimpleCard
        title="Recomendaciones adicionales"
        text={
          <div>
            <p style={{ margin: '0 0 16px 0' }}>
                <strong>Revisión:</strong><br />
                Evitar errores ortográficos y de sintaxis
            </p>
            <p style={{ margin: '0 0 16px 0' }}>
                <strong>Formato:</strong><br />
                Los textos deben ser inéditos y de autoría propia
            </p>
            <div style={{ marginBottom: '16px' }}>
                <p style={{ margin: '0 0 4px 0' }}><strong>Idioma:</strong></p>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: '0' }}>
                    <li>Científico/divulgación: Rigor pero claridad</li>
                    <li>Creativos: Libertad expresiva, pero respetuosa</li>
                </ul>
            </div>
            <p style={{ margin: '0' }}>
                <strong>Imágenes:</strong><br />
                Enviar con permisos de uso y calidad mínima de 300 DPI. Recuerda que tus archivos deben subirse a un medio como drive, youtube para que lo podamos publicar.
            </p>
          </div>
        }
      />

      <SimpleCard
        title="Proceso de envío y evaluación"
        text={
          <div>
            <p style={{ marginBottom: '8px', fontWeight: 600 }}>
              1) Enviar el texto a gaceta@upqroo.edu.mx con el asunto: "Tipo de contribución - Título" (ej: "Relato corto - La ciudad de los espejos")
            </p>
            <p style={{ marginBottom: '8px', fontWeight: 600 }}>
              2) Revisión editorial: El equipo evaluará pertinencia, calidad y ajuste a las normas
            </p>
            <p style={{ marginBottom: '8px', fontWeight: 600 }}>
              3) Retroalimentación: En caso de correcciones, se notificará al autor
            </p>
            <p style={{ fontWeight: 600 }}>
              4) Publicación: Los seleccionados se publicarán en la edición impresa o digital, con crédito al autor
            </p>
          </div>
        }
      />

      <InvitationCard />
    </div>
  );
};