export interface ArticleInterface {
  idArticulo: number;
  Titulo: string;
  Resumen: string;
  Contenido: string;
  Comentario: string;
  Estatus: number;
  FechaCreacion: string;   // ISO string
  FechaRevision: string;   // ISO string
  IdCategoria: number;
}

export enum Categoria {
  CienciaTecnologia = "Ciencia y Tecnología",
  Humanidades = "Humanidades",
  SocialPolitica = "Social y política",
  Logros = "Logros",
}

export enum Etiqueta {
  ArticuloAcademico = "Artículo académico",
  ArticuloDifusion = "Artículo de difusión",
  NotaSocial = "Nota social",
  Arte = "Arte",
  Historieta = "Historieta",
  RelatoCorto = "Relato corto",
  Logro = "Logro",
}


//información de home 

import { Home, Category, Tag, LogroUs, Event } from "./user";

export const featuredNotices: Home[] = [
  {
    id: 1,
    title: "Proyecto Campus Verde: Energía Solar y Sostenibilidad",
    author: "Comité Verde Estudiantil",
    category: Category.SocialPolitica,
    content: "Iniciativa universitaria para implementar sistemas sostenibles y programas de reciclaje integral en todo el campus.",
    status: "publicado",
    etiqueta: [Tag.Logro, Tag.ArticuloAcademico],
    publishedAt: "2024-01-05",
    createdAt: "2024-01-03",
  },
  {
    id: 2,
    title: "Descubrimiento revolucionario en biotecnología marina",
    author: "Dr. María González",
    category: Category.CienciaTecnologia,
    content: "Equipo de investigadores desarrolla innovador método para tratamiento de enfermedades genéticas usando organismos marinos.",
    status: "publicado",
    etiqueta: [Tag.NotaSocial, Tag.ArticuloDifusion],
    publishedAt: "2024-01-12",
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    title: "Festival Internacional de Danza Contemporánea 2024",
    author: "Ana Rodríguez",
    category: Category.Humanidades,
    content: "La universidad será sede del festival más importante de danza contemporánea de la región.",
    status: "publicado",
    etiqueta: [Tag.Arte, Tag.NotaSocial],
    publishedAt: "2024-01-10",
    createdAt: "2024-01-08",
  },
  {
    id: 4,
    title: "Torneo Interuniversitario de Fútbol Copa Universitaria",
    author: "Equipo de Deportes",
    category: Category.Logros,
    content: "Nuestro equipo universitario se prepara para competir en el campeonato más importante del año académico.",
    status: "publicado",
    etiqueta: [Tag.Logro],
    publishedAt: "2024-01-08",
    createdAt: "2024-01-06",
  },
  {
    id: 5,
    title: "Publicación de investigación sobre cambio climático costero",
    author: "Mtro. Luis Hernández",
    category: Category.CienciaTecnologia,
    content: "Artículo académico enfocado en los efectos del cambio climático en las zonas litorales del Caribe mexicano.",
    status: "publicado",
    etiqueta: [Tag.ArticuloAcademico],
    publishedAt: "2024-01-14",
    createdAt: "2024-01-11",
  },
];

export const allNotices: Home[] = [
  {
    id: 1,
    title: "Festival Internacional de Danza Contemporánea 2024",
    author: "Ana Rodríguez",
    category: Category.Humanidades,
    content: "La universidad será sede del festival más importante de danza contemporánea de la región.",
    status: "publicado",
    etiqueta: [Tag.Arte, Tag.NotaSocial],
    publishedAt: "2024-01-10",
    createdAt: "2024-01-08",
  },
  {
    id: 2,
    title: "Torneo Interuniversitario de Fútbol Copa Universitaria",
    author: "Equipo de Deportes",
    category: Category.Logros,
    content: "Nuestro equipo universitario se prepara para competir en el campeonato más importante del año académico.",
    status: "publicado",
    etiqueta: [Tag.Logro],
    publishedAt: "2024-01-08",
    createdAt: "2024-01-06",
  },
  {
    id: 3,
    title: "Concurso de Historieta Universitaria 2024",
    author: "Coordinación de Cultura",
    category: Category.Humanidades,
    content: "Estudiantes de diferentes carreras participan en un certamen artístico que busca fomentar la creatividad narrativa y gráfica.",
    status: "publicado",
    etiqueta: [Tag.Historieta],
    publishedAt: "2024-01-15",
    createdAt: "2024-01-12",
  },
  {
    id: 4,
    title: "Publicación de investigación sobre cambio climático costero",
    author: "Mtro. Luis Hernández",
    category: Category.CienciaTecnologia,
    content: "Artículo académico enfocado en los efectos del cambio climático en las zonas litorales del Caribe mexicano.",
    status: "publicado",
    etiqueta: [Tag.ArticuloAcademico],
    publishedAt: "2024-01-14",
    createdAt: "2024-01-11",
  },
];


//eventos
export const eventos: Event[] = [
  {
    id: 1,
    titulo: "Feria de Empleo Universitario",
    fecha: "15/01/2024",
    hora: "09:00 AM",
    lugar: "Auditorio Principal",
    descripcion: "Más de 50 empresas buscan talento universitario.",
    descripcion_larga:
      "La Feria de Empleo Universitario reunirá a más de 50 empresas líderes que ofrecerán vacantes exclusivas para estudiantes y egresados. Habrá módulos de atención para recepción de CV, entrevistas rápidas, talleres de empleabilidad y conferencias sobre tendencias laborales. Es una gran oportunidad para comenzar tu carrera profesional.",
    enlace: "#evento-1",
  },
  {
    id: 2,
    titulo: "Simposio de Investigación",
    fecha: "20/01/2024",
    hora: "14:00 PM",
    lugar: "Centro de Convenciones",
    descripcion: "Presentación de proyectos de investigación estudiantil.",
    descripcion_larga:
      "Este simposio reunirá a estudiantes de diversas facultades que presentarán proyectos de investigación en áreas como tecnología, medio ambiente, salud y educación. Se contará con la participación de ponentes invitados, revisores académicos y sesiones de preguntas para fomentar el intercambio científico.",
    enlace: "#evento-2",
  },
  {
    id: 3,
    titulo: "Torneo Deportivo Interfacultades",
    fecha: "25/01/2024",
    hora: "08:00 AM",
    lugar: "Complejo Deportivo",
    descripcion: "Competencias en múltiples disciplinas deportivas.",
    descripcion_larga:
      "El torneo deportivo contará con competencias en fútbol, básquetbol, voleibol, atletismo y más. Cada facultad participará con sus equipos representativos. Se premiará a los ganadores con medallas, trofeos y puntos para el ranking anual universitario. Habrá música en vivo, food trucks y zona de animación.",
    enlace: "#evento-3",
  },
  {
    id: 4,
    titulo: "Conferencia de Emprendimiento",
    fecha: "10/02/2024",
    hora: "16:00 PM",
    lugar: "Sala de Conferencias",
    descripcion: "Historia de éxito de egresados emprendedores.",
    descripcion_larga:
      "En esta conferencia, varios egresados compartirán su experiencia como fundadores de startups exitosas. Hablarán sobre los desafíos, aprendizajes y oportunidades en el mundo del emprendimiento. También se ofrecerá una sesión de networking y un panel de preguntas abiertas con los invitados.",
    enlace: "#evento-4",
  },

];

//seccion logros

export const logros: LogroUs[] = [
  {
    icono: "Star",
    titulo: "Premio Nacional de Comunicación Universitaria",
    descripcion: "Reconocimiento por excelencia en comunicación institucional 2023",
    anio: "2023",
  },
  {
    icono: "CheckCheck",
    titulo: "Alcance Internacional",
    descripcion: "Más de 50,000 lectores mensuales de 25 países diferentes",
    anio: "2024",
  },
  {
    icono: "BookOpenText",
    titulo: "500+ Artículos Publicados",
    descripcion: "Amplio archivo de investigaciones, noticias y eventos universitarios",
    anio: "2024",
  },
  {
    icono: "Users",
    titulo: "Red de Colaboradores",
    descripcion: "Más de 100 redactores y colaboradores activos",
    anio: "2024",
  },
];
