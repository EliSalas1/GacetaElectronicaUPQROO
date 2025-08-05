export const HEADER_OPTIONS_BY_ROLE: Record<string, Record<string, string>[]> = {
  Administrador: [{
    label: "Inicio",
    href: "/",
  },{
    label: "Categorías",
    href: "/publica/categorias",
  }, {
    label: "Panel de Administración",
    href: "/private/administrador",
  }],
  Redactor: [{
    label: "Inicio",
    href: "/",
  },{
    label: "Categorías",
    href: "/publica/categorias",
  }, {
    label: "Panel de Redactor",
    href: "/private/redactor",
  }],
  Supervisor: [{
    label: "Inicio",
    href: "/",
  },{
    label: "Categorías",
    href: "/publica/categorias",
  }, {
    label: "Panel de Supervisor",
    href: "/private/supervisor",
  }],
}

export enum ROLE_NAME {
  "Administrador" = "Administrador",
  "Redactor" = "Redactor", 
  "Supervisor" = "Supervisor"
}