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