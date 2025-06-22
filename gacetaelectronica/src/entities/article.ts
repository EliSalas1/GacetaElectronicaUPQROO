export interface ArticleInterface {
  id: number,
  title: string,
  author: string,
  category: Categoria | string,
  content: string,
  status: string,
  etiqueta?: Etiqueta | string
  publishedAt?: string | null
  createdAt: string,
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
