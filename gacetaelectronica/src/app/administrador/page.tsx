"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, Settings, Plus } from "lucide-react"
import UserManagement from "@/components/administrador/UserManagement"
import ArticleOverview from "@/components/administrador/ArticleOverview"
import PrivateHeader from "@/components/PrivateHeader"
import AgregarEvento from "@/components/administrador/AgregarEvento"
import { useFetch } from "@/hooks/useFetch"
import { Spinner } from "@/components/Spinner"

export default function Page() {
  const [activeTab, setActiveTab] = useState("overview")
  const { data, loading } = useFetch("api/usuarios")
  const { data: dataArticulos, loading: loadingArticulos } = useFetch("api/articulos")

  const totalUsuarios = Array.isArray(data) ? data.length : 0
  const articulosPublicados = Array.isArray(dataArticulos)
    ? dataArticulos.filter((item) => item.Estatus === 3).length
    : 0
  const articulosEnRevision = Array.isArray(dataArticulos)
    ? dataArticulos.filter((item) => item.Estatus === 1).length
    : 0
  const redactoresActivos = Array.isArray(data)
    ? data.filter((item) => item.Rol === "Autor").length
    : 0

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

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                      <p className="text-xs text-muted-foreground">+2 desde el mes pasado</p>
                    </>
                  )}
                </CardContent>
              </Card>

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
                      <div className="text-2xl font-bold">{articulosPublicados}</div>
                      <p className="text-xs text-muted-foreground">+12 esta semana</p>
                    </>
                  )}
                </CardContent>
              </Card>

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
                      <div className="text-2xl font-bold">{articulosEnRevision}</div>
                      <p className="text-xs text-muted-foreground">Pendientes de aprobación</p>
                    </>
                  )}
                </CardContent>
              </Card>

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
  )
}
