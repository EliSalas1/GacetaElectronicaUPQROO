import { BookOpen, FileText, Newspaper, Users, PenLine, Palette } from "lucide-react";

const contributionTypes = [
  {
    title: "Artículos científicos",
    description: "Investigaciones originales o revisiones breves",
    icon: <BookOpen className="h-5 w-5 text-blue-500" />,
    bg: "bg-blue-50",
  },
  {
    title: "Artículos de divulgación",
    description: "Temas científicos o culturales explicados al público general",
    icon: <FileText className="h-5 w-5 text-green-500" />,
    bg: "bg-green-50",
  },
  {
    title: "Notas periodísticas",
    description: "Noticias sobre eventos, logros o actividades universitarias",
    icon: <Newspaper className="h-5 w-5 text-orange-500" />,
    bg: "bg-orange-50",
  },
  {
    title: "Notas sociales",
    description: "Crónicas, homenajes o entrevistas a miembros de la comunidad",
    icon: <Users className="h-5 w-5 text-purple-500" />,
    bg: "bg-purple-50",
  },
  {
    title: "Relatos cortos",
    description: "Cuentos, microficciones o poesía",
    icon: <PenLine className="h-5 w-5 text-indigo-500" />,
    bg: "bg-indigo-50",
  },
  {
    title: "Historietas o ilustraciones",
    description: "Arte gráfico narrativo o conceptual",
    icon: <Palette className="h-5 w-5 text-pink-500" />,
    bg: "bg-pink-50",
  },
];

export default function ContributionsCard() {
  return (
    <section className="bg-white border rounded-xl p-6 mb-6 shadow-sm">
      <div className="flex items-start gap-2 mb-4">
        <h2 className="text-lg font-semibold text-[#4C0000]">Tipos de contribuciones aceptadas</h2>
      </div>
      <p className="text-sm text-gray-700 mb-6">
        La gaceta acepta los siguientes géneros:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contributionTypes.map((item, index) => (
          <div key={index} className={`p-4 border rounded-lg ${item.bg} flex items-start gap-3 hover:shadow-md transition-shadow duration-200`}>
            {item.icon}
            <div className="text-left">
              <h3 className="text-sm font-semibold text-[#4C0000]">{item.title}</h3>
              <p className="text-sm text-gray-700">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-600 mt-4">
        <strong>Otros formatos creativos:</strong> Ensayos literarios, fotoreportajes, etc.
      </p>
    </section>
  );
}
