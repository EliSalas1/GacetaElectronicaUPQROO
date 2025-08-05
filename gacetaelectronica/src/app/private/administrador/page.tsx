"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FileText, Settings, Plus } from "lucide-react";
import { Spinner } from "@/components/Spinner";
import UserManagement from "@/components/administrador/UserManagement";
import ArticleOverview from "@/components/administrador/ArticleOverview";
import EventOverview from "@/components/administrador/EventsOverview";
import PrivateHeader from "@/components/PrivateHeader";
import AgregarEvento from "@/components/administrador/AgregarEvento";

export default function Page() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalArticulos, setTotalArticulos] = useState(0);
  const [articulosPublicados, setArticulosPublicados] = useState(0);
  const [articulosPendientes, setArticulosPendientes] = useState(0);
  const [totalEventos, setTotalEventos] = useState(0);
  const [redactoresActivos, setRedactoresActivos] = useState(0);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Cargar usuarios
      const usuariosResponse = await fetch('/api/usuarios');
      if (usuariosResponse.ok) {
        const usuarios = await usuariosResponse.json();
        setTotalUsuarios(usuarios.length);
        setRedactoresActivos(usuarios.filter((user: any) => user.Rol === "Autor").length);
      }

      // Cargar artículos
      const articulosResponse = await fetch('/api/articulos');
      if (articulosResponse.ok) {
        const articulos = await articulosResponse.json();
        setTotalArticulos(articulos.length);
        setArticulosPublicados(articulos.filter((item: any) => item.status === 'published').length);
        setArticulosPendientes(articulos.filter((item: any) => item.status === 'pending').length);
      }

      // Cargar eventos
      const eventosResponse = await fetch('/api/eventos');
      if (eventosResponse.ok) {
        const eventos = await eventosResponse.json();
        setTotalEventos(eventos.length);
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

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
                   {loading ? (
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
                   {loading ? (
                     <Spinner />
                   ) : (
                     <>
                       <div className="text-2xl font-bold">{articulosPublicados}</div>
                       <p className="text-xs text-muted-foreground">
                         De {totalArticulos} total
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
                   {loading ? (
                     <Spinner />
                   ) : (
                     <>
                       <div className="text-2xl font-bold">{articulosPendientes}</div>
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
                   {loading ? (
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
                   {loading ? (
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
