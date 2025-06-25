export interface UserInterface {
  id: number,
  name: string,
  email: string,
  role: string,
  status: string,
  createdAt: string,
}

export interface UserEditDTO {
  name: string,
  email: string,
  role: string,
  status: string,
}

//  Estas estructuras permiten una organización clara y validación de los datos 
//  que serán mostrados en la interfaz de home.

export interface Home {
  id: number;
  title: string;
  author: string;
  category: Category | string;
  content: string;
  status: string;
  etiqueta?: (Tag | string)[];
  publishedAt: string | null;
  createdAt: string;
}

export enum Category {
  CienciaTecnologia = "Ciencia y Tecnología",
  Humanidades = "Humanidades",
  SocialPolitica = "Social y política",
  Logros = "Logros",
}

export enum Tag {
  ArticuloAcademico = "Artículo académico",
  ArticuloDifusion = "Artículo de difusión",
  NotaSocial = "Nota social",
  Arte = "Arte",
  Historieta = "Historieta",
  RelatoCorto = "Relato corto",
  Logro = "Logro",
}

//eventos

export interface Event {
  id: number;
  titulo: string;
  fecha: string;   // formato: "dd/mm/yyyy"
  hora: string;    // formato: "hh:mm AM/PM"
  lugar: string;
  descripcion: string;
  descripcion_larga?: string //para mostrar descripcion mas larga en el modal
  enlace: string;
}

export interface LogroUs {
  icono: "Star" | "CheckCheck" | "BookOpenText" | "Users";
  titulo: string;
  descripcion: string;
  anio: string;
}

