"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SupervisorContainer } from "./components/container";
import { useSessionUser } from "@/hooks/useSessionUser";

export default function SupervisorPage() {
  const router = useRouter();
  const { userInfo, loading, status } = useSessionUser();

  useEffect(() => {
    if (!loading && status === "unauthenticated") {
      router.push("/publica/login");
    }

    if (!loading && userInfo?.role !== "Revisor") {
      router.push("/forbidden");
    }
}, [router, loading, userInfo?.role, status]);

  return <SupervisorContainer />;
}
