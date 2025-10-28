"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/administrador/UserManagement";
import ArticleOverview from "@/components/administrador/ArticleOverview";
import PrivateHeader from "@/components/PrivateHeader";
import AgregarEvento from "@/components/administrador/AgregarEvento";
import ResumenDashboard from "@/components/administrador/ResumenDashboard";
import { useInitializeUser } from "@/hooks/useInitializeUser";

export default function Page() {
  useInitializeUser("Administrador");

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "Admin") {
      router.replace("/forbidden");
    }
  }, [session, status, router]);

  if (status === "loading" || !session || session.user.role !== "Admin") {
    return null;
  }

  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      <PrivateHeader />

      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-muted-foreground">
            Gestiona usuarios, supervisa contenido y configura el sistema
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="articles">Artículos</TabsTrigger>
            <TabsTrigger value="addEvent">Añadir evento</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ResumenDashboard />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="articles">
            <ArticleOverview />
          </TabsContent>

          <TabsContent value="addEvent">
            <AgregarEvento />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
