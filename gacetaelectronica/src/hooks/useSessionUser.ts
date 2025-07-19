import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

interface UserInfo {
  id: number
  name: string
  email: string
  role: string
}

export function useSessionUser() {
  const { data: session, status } = useSession()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (status === 'loading') return

      if (status === 'unauthenticated') {
        setLoading(false)
        return
      }

      if (session?.user?.email) {
        try {
          const response = await fetch('/api/auth/user')
          
          if (response.ok) {
            const userData = await response.json()
            setUserInfo({
              id: userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.role
            })
          } else {
            console.error('Error al obtener información del usuario')
          }
        } catch (error) {
          console.error('Error al obtener información del usuario:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [session, status])

  return { userInfo, loading, status }
} 