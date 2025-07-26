"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FileText, Settings, Plus } from "lucide-react";
import UserManagement from "@/components/administrador/UserManagement";
import ArticleOverview from "@/components/administrador/ArticleOverview";
import PrivateHeader from "@/components/PrivateHeader";
import AgregarEvento from "@/components/administrador/AgregarEvento";
import { useFetch } from "@/hooks/useFetch";
import { Spinner } from "@/components/Spinner";
import { UserInterface } from "@/entities/user";
import { useInitializeUser } from "@/hooks/useInitializeUser";

type ItemConFecha = {
  FechaCreacion: string;
  [key: string]: any;
};

function filtrarPorUltimoMes<T extends ItemConFecha>(items: T[]): T[] {
  const ahora = new Date();
  const haceUnMes = new Date();
  haceUnMes.setMonth(ahora.getMonth() - 1);

  return items.filter((item) => {
    const fecha = new Date(item.FechaCreacion);
    return fecha >= haceUnMes && fecha <= ahora;
  });
}

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Protección de ruta cliente
  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "Admin") {
      router.replace("/forbidden");
    }
  }, [session, status, router]);

  // Si está cargando la sesión, evita el render
  if (status === "loading" || !session || session.user.role !== "Admin") {
    return null;
  }

  useInitializeUser("Administrador");
  const [activeTab, setActiveTab] = useState("overview");
  const { data, loading } = useFetch<UserInterface>("api/usuarios");
  const { data: dataArticulos, loading: loadingArticulos } =
    useFetch("api/articulos");

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

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="articles">Artículos</TabsTrigger>
            <TabsTrigger value="addEvent">Añadir evento</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Usuarios
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Spinner />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        {Array.isArray(data) ? data.length : ""}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +
                        {Array.isArray(data)
                          ? filtrarPorUltimoMes(data).length
                          : "0"}{" "}
                        desde el mes pasado
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Artículos Publicados
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loadingArticulos ? (
                    <Spinner />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        {Array.isArray(dataArticulos)
                          ? dataArticulos.filter((item) => item.Estatus === 3)
                              .length
                          : ""}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +
                        {Array.isArray(dataArticulos)
                          ? filtrarPorUltimoMes(dataArticulos).length
                          : "0"}{" "}
                        esta semana
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    En Revisión
                  </CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loadingArticulos ? (
                    <Spinner />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        {Array.isArray(dataArticulos)
                          ? dataArticulos.filter((item) => item.Estatus === 1)
                              .length
                          : ""}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Pendientes de aprobación
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Redactores Activos
                  </CardTitle>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Spinner />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        {Array.isArray(data)
                          ? data.filter((item) => item.Rol === "Autor").length
                          : ""}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        De {Array.isArray(data) ? data.length : "0"} total
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
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
