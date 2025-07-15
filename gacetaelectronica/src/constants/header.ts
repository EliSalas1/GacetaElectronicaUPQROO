export const HEADER_OPTIONS_BY_ROLE: Record<string, Record<string, string>[]> = {
  Administrador: [{
    label: "Inicio",
    href: "/",
  },{
    label: "Categorías",
    href: "/categorias",
  }, {
    label: "Panel de Administración",
    href: "/administrador",
  }],
  Redactor: [{
    label: "Inicio",
    href: "/",
  },{
    label: "Categorías",
    href: "/categorias",
  }, {
    label: "Panel de Redactor",
    href: "/redactor",
  }],
  Supervisor: [{
    label: "Inicio",
    href: "/",
  },{
    label: "Categorías",
    href: "/categorias",
  }, {
    label: "Panel de Supervisor",
    href: "/supervisor",
  }],
}

export enum ROLE_NAME {
  "admin" = "Administrador",
  "editor" = "Editor",
  "redactor" = "Redactor"
}