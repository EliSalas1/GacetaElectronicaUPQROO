"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FileText, Settings, Plus } from "lucide-react";
import { Spinner } from "@/components/Spinner";
import { useFetch } from "@/hooks/useFetch";
import UserManagement from "@/components/administrador/UserManagement";
import ArticleOverview from "@/components/administrador/ArticleOverview";
import EventOverview from "@/components/administrador/EventsOverview";
import PrivateHeader from "@/components/PrivateHeader";
import AgregarEvento from "@/components/administrador/AgregarEvento";

export default function Page() {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: dataUsuarios, loading: loadingUsuarios } = useFetch("api/usuarios");
  const { data: dataArticulos, loading: loadingArticulos } = useFetch("api/articulos");
  const { data: dataEventos, loading: loadingEventos } = useFetch("api/eventos");

  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalArticulos, setTotalArticulos] = useState(0);
  const [totalEventos, setTotalEventos] = useState(0);
  const [redactoresActivos, setRedactoresActivos] = useState(0);

  useEffect(() => {
    if (!loadingUsuarios && dataUsuarios) {
      setTotalUsuarios(dataUsuarios.length);
      setRedactoresActivos(dataUsuarios.filter((user) => user.Rol === "Autor").length);
    }
  }, [dataUsuarios, loadingUsuarios]);

  useEffect(() => {
    if (!loadingArticulos && dataArticulos) {
      setTotalArticulos(dataArticulos.length);
    }
  }, [dataArticulos, loadingArticulos]);

  useEffect(() => {
    if (!loadingEventos && dataEventos) {
      setTotalEventos(dataEventos.length);
    }
  }, [dataEventos, loadingEventos]);

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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="articles">Artículos</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="addEvent">Añadir evento</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Total Usuarios */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loadingUsuarios ? (
                    <Spinner />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{totalUsuarios}</div>
                      <p className="text-xs text-muted-foreground">
                        +{totalUsuarios} desde el mes pasado
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Artículos Publicados */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Artículos Publicados</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loadingArticulos ? (
                    <Spinner />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{totalArticulos}</div>
                      <p className="text-xs text-muted-foreground">
                        +{totalArticulos} esta semana
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* En Revisión */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En Revisión</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loadingArticulos ? (
                    <Spinner />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        {dataArticulos?.filter((item) => item.Estatus === 1).length || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">Pendientes de aprobación</p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Redactores Activos */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Redactores Activos</CardTitle>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loadingUsuarios ? (
                    <Spinner />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{redactoresActivos}</div>
                      <p className="text-xs text-muted-foreground">De {totalUsuarios} total</p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Total de Eventos */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loadingEventos ? (
                    <Spinner />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{totalEventos}</div>
                      <p className="text-xs text-muted-foreground">
                        +{totalEventos} este mes
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

          <TabsContent value="events">
            <EventOverview /> {/* Aquí agregas el componente de Eventos */}
          </TabsContent>

          <TabsContent value="addEvent">
            <AgregarEvento />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
