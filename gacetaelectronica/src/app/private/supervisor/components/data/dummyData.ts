// Datos dummy para el resumen del supervisor
export interface ResumenData {
  totalArticulos: number
  articulosPendientes: number
  articulosPublicados: number
  articulosRechazados: number
}

export const resumenDummyData: ResumenData = {
  totalArticulos: 45,
  articulosPendientes: 8,
  articulosPublicados: 32,
  articulosRechazados: 5
}

// Datos dummy para artículos pendientes de revisión
export interface ArticuloPendiente {
  id: number
  titulo: string
  autor: string
  categoria: string
  fechaEnvio: string
}

export const articulosPendientesDummyData: ArticuloPendiente[] = [
  {
    id: 1,
    titulo: "Innovaciones en Inteligencia Artificial",
    autor: "Dr. Juan Pérez",
    categoria: "Ciencia y Tecnología",
    fechaEnvio: "2024-12-20"
  },
  {
    id: 2,
    titulo: "Historia de la Universidad de Quintana Roo",
    autor: "Dra. María García",
    categoria: "Humanidades",
    fechaEnvio: "2024-12-19"
  },
  {
    id: 3,
    titulo: "Análisis del Impacto Social del Turismo",
    autor: "Mtro. Carlos López",
    categoria: "Social y Política",
    fechaEnvio: "2024-12-18"
  },
  {
    id: 4,
    titulo: "Nuevos Métodos de Enseñanza",
    autor: "Dra. Ana Martínez",
    categoria: "Educación",
    fechaEnvio: "2024-12-17"
  }
]

// Datos dummy para historial de revisiones
export interface ArticuloHistorial {
  id: number
  titulo: string
  autor: string
  fechaRevision: string
  decision: 'Publicado' | 'Rechazado'
  retroalimentacion: string
}

export const historialDummyData: ArticuloHistorial[] = [
  {
    id: 1,
    titulo: "Biodiversidad en la Península de Yucatán",
    autor: "Dr. Luis Rodríguez",
    fechaRevision: "2024-12-15",
    decision: "Publicado",
    retroalimentacion: "Excelente investigación con metodología sólida. Aprobado sin cambios."
  },
  {
    id: 2,
    titulo: "Impacto Económico del COVID-19",
    autor: "Dra. Sofia Hernández",
    fechaRevision: "2024-12-14",
    decision: "Rechazado",
    retroalimentacion: "La metodología presenta inconsistencias. Se requiere revisar las fuentes estadísticas."
  },
  {
    id: 3,
    titulo: "Arte Maya Contemporáneo",
    autor: "Mtro. Miguel Torres",
    fechaRevision: "2024-12-12",
    decision: "Publicado",
    retroalimentacion: "Trabajo bien documentado. Se sugieren pequeños ajustes en la conclusión."
  },
  {
    id: 4,
    titulo: "Desarrollo Sustentable en el Caribe",
    autor: "Dra. Carmen Jiménez",
    fechaRevision: "2024-12-10",
    decision: "Publicado",
    retroalimentacion: "Propuesta innovadora con gran relevancia regional. Aprobado."
  }
]
