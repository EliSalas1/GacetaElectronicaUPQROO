"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { UserProvider } from "@/contexts/UserContext";
import { Toaster } from "@/components/ui/sonner";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session;
}) {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        {children}
        <Toaster />
      </UserProvider>
    </SessionProvider>
  );
}
