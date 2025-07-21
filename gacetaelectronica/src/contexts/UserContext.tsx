"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface User {
  name: string
  email: string
  image?: string
}

export type UserRole = 'Administrador' | 'Redactor' | 'Supervisor'

interface UserContextType {
  user: User | null
  role: UserRole | null
  setUser: (user: User) => void
  setRole: (role: UserRole) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [role, setRoleState] = useState<UserRole | null>(null)

  const setUser = (user: User) => {
    setUserState(user)
  }

  const setRole = (role: UserRole) => {
    setRoleState(role)
  }

  const logout = () => {
    setUserState(null)
    setRoleState(null)
  }

  return (
    <UserContext.Provider
      value={{
        user,
        role,
        setUser,
        setRole,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
