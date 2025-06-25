"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle } from "lucide-react"
import ArticleEditor from "@/components/redactor/ArticleEditor"
import MyArticles from "@/components/redactor/MyArticles"
import PrivateHeader from "@/components/PrivateHeader"
import { useInitializeUser } from "@/hooks/useInitializeUser"

export default function Page() {
  useInitializeUser("Redactor")
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      <PrivateHeader />
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Panel de Redacción</h1>
          <p className="text-muted-foreground">Crea y gestiona tus artículos para la gaceta electrónica</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="new-article">Nuevo Artículo</TabsTrigger>
            <TabsTrigger value="my-articles">Mis Artículos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 justify-center">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Artículos Publicados</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">En total</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En Revisión</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Pendientes de aprobación</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="new-article">
            <ArticleEditor />
          </TabsContent>

          <TabsContent value="my-articles">
            <MyArticles />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
