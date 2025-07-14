"use client"

import { UserProvider } from "@/contexts/UserContext"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      {children}
      <Toaster />
    </UserProvider>
  )
}
