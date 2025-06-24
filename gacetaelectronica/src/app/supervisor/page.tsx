"use client"

import { SupervisorContainer } from "./components/container";
import { useInitializeUser } from "@/hooks/useInitializeUser";

export interface SupervisorPageProps {}

export default function SupervisorPage() {
  useInitializeUser("Supervisor");

  return (
    <SupervisorContainer />
  );
}