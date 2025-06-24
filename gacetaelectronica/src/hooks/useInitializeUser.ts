import { useUser, User, UserRole } from '@/contexts/UserContext'
import { useEffect } from 'react'

// Usuarios dummy para cada rol
const DUMMY_USERS: Record<UserRole, User> = {
  Administrador: {
    name: "María Administradora",
    email: "admin@upqroo.edu.mx",
    image: "https://via.placeholder.com/150"
  },
  Redactor: {
    name: "Carlos Redactor",
    email: "redactor@upqroo.edu.mx",
    image: "https://via.placeholder.com/150"
  },
  Supervisor: {
    name: "Juan Supervisor",
    email: "supervisor@upqroo.edu.mx",
    image: "https://via.placeholder.com/150"
  }
}

/**
 * Hook para inicializar un usuario dummy basado en el rol
 * @param role - El rol del usuario a inicializar
 */
export function useInitializeUser(role: UserRole) {
  const { setUser, setRole } = useUser()

  useEffect(() => {
    const dummyUser = DUMMY_USERS[role]
    setUser(dummyUser)
    setRole(role)
  }, [role, setUser, setRole])
}
