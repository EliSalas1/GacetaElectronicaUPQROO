"use client";

import { SupervisorContainer } from "./components/container";
import { useInitializeUser } from "@/hooks/useInitializeUser";

export interface SupervisorPageProps {}

export default function SupervisorPage() {
  // TODO: Este hook es solo para hacer dinámico el componente durante desarrollo.
  // El rol se debe obtener desde el backend mediante autenticación real.
  useInitializeUser("Supervisor");

  return <SupervisorContainer />;
}
