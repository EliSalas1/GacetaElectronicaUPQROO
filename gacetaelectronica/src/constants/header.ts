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

export const ROLE_NAME: Record<string, string> = {
  "Administrador": "Administrador",
  "Redactor": "Redactor",
  "Supervisor": "Supervisor"
}