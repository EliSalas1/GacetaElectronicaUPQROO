export const HEADER_OPTIONS_BY_ROLE: Record<string, Record<string, string>[]> = {
  admin: [{
    label: "Resumen",
    href: "/admin/resumen",
  },{
    label: "Articulos",
    href: "/admin/articulos",
  }, {
    label: "Usuarios",
    href: "/admin/usuarios",
  }],
  editor: [],
}

export enum ROLE_NAME {
  "admin" = "Administrador",
  "editor" = "Editor"
}