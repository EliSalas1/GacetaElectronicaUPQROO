export const HEADER_OPTIONS_BY_ROLE: Record<string, Record<string, string>[]> = {
  admin: [{
    label: "Inicio",
    href: "/",
  },{
    label: "Categorías",
    href: "/categorias",
  }, {
    label: "Panel de Administración",
    href: "/administrador",
  }],
  editor: [],
}

export enum ROLE_NAME {
  "admin" = "Administrador",
  "editor" = "Editor",
  "redactor" = "Redactor"
}