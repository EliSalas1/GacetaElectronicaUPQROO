"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save } from "lucide-react"
import { toast } from "sonner"

export default function SystemSettings() {

  const handleSaveSettings = () => {
    toast.message("Configuración guardada", {
      description: "Los cambios han sido guardados exitosamente",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración General</CardTitle>
          <CardDescription>Ajusta la configuración básica del sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Nombre del Sitio</Label>
            <Input id="site-name" defaultValue="Gaceta Electrónica Universidad" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-description">Descripción</Label>
            <Textarea id="site-description" defaultValue="Portal informativo oficial de la universidad" rows={3} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="maintenance-mode" />
            <Label htmlFor="maintenance-mode">Modo de mantenimiento</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Notificaciones</CardTitle>
          <CardDescription>Gestiona las notificaciones del sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="email-notifications" defaultChecked />
            <Label htmlFor="email-notifications">Notificaciones por email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="review-notifications" defaultChecked />
            <Label htmlFor="review-notifications">Notificar nuevas revisiones</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="publish-notifications" defaultChecked />
            <Label htmlFor="publish-notifications">Notificar publicaciones</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Contenido</CardTitle>
          <CardDescription>Ajusta las reglas para el contenido</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="max-file-size">Tamaño máximo de archivo (MB)</Label>
            <Input id="max-file-size" type="number" defaultValue="10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="allowed-formats">Formatos permitidos</Label>
            <Input id="allowed-formats" defaultValue="jpg, png, gif, mp4, pdf" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="auto-publish" />
            <Label htmlFor="auto-publish">Publicación automática</Label>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full" onClick={handleSaveSettings}>
        <Save className="mr-2 h-4 w-4" />
        Guardar Configuración
      </Button>
    </div>
  )
}
