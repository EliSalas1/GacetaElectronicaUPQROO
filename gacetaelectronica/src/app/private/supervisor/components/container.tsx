"use client";

import PrivateHeader from "@/components/PrivateHeader";
import { FC, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ResumenTab from "./ResumenTab";
import PendientesTab from "./PendientesTab";
import HistorialTab from "./HistorialTab";
import { useTableFilter } from "@/hooks/useTableFilter";
import { articulosPendientesDummyData, historialDummyData, ArticuloPendiente, ArticuloHistorial } from "./data/dummyData";

export interface SupervisorContainerProps {}

export const SupervisorContainer: FC<SupervisorContainerProps> = () => {
  const [activeTab, setActiveTab] = useState("resumen");

  // Configuración de filtros para artículos pendientes
  const pendientesFilterConfig = {
    searchFields: ['titulo', 'autor'] as (keyof ArticuloPendiente)[],
    filterFields: {
      categoria: {
        label: 'Categoría',
        key: 'categoria' as keyof ArticuloPendiente
      },
      autor: {
        label: 'Autor',
        key: 'autor' as keyof ArticuloPendiente
      },
      fechaEnvio: {
        label: 'Fecha de Envío',
        key: 'fechaEnvio' as keyof ArticuloPendiente
      }
    }
  };

  // Configuración de filtros para historial
  const historialFilterConfig = {
    searchFields: ['titulo', 'autor', 'retroalimentacion'] as (keyof ArticuloHistorial)[],
    filterFields: {
      decision: {
        label: 'Decisión',
        key: 'decision' as keyof ArticuloHistorial
      },
      autor: {
        label: 'Autor',
        key: 'autor' as keyof ArticuloHistorial
      },
      fechaRevision: {
        label: 'Fecha de Revisión',
        key: 'fechaRevision' as keyof ArticuloHistorial
      }
    }
  };

  // Hooks de filtrado para cada tabla

  const handleViewArticle = (articleId: number) => {
    // Aquí se implementará la navegación al artículo específico
    // Por ahora solo logueamos el ID
    console.log(`Navigating to article with ID: ${articleId}`);
    // En el futuro: router.push(`/supervisor/articulo/${articleId}`)
  };

  return (
    <>
      <PrivateHeader />
      <div className="container mx-auto p-3 sm:p-4 lg:p-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Panel de Supervisor</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-10">
            <TabsTrigger 
              value="resumen" 
              className="text-xs sm:text-sm py-2 sm:py-1.5"
            >
              Resumen
            </TabsTrigger>
            <TabsTrigger 
              value="pendientes" 
              className="text-xs sm:text-sm py-2 sm:py-1.5"
            >
              <span className="hidden sm:inline">Pendientes de revisión</span>
              <span className="sm:hidden">Pendientes</span>
            </TabsTrigger>
            <TabsTrigger 
              value="historial" 
              className="text-xs sm:text-sm py-2 sm:py-1.5"
            >
              Historial
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="resumen" className="mt-4 sm:mt-6">
            <ResumenTab />
          </TabsContent>
          
          <TabsContent value="pendientes" className="mt-4 sm:mt-6">
            <PendientesTab 
              //onViewArticle={handleViewArticle}
              // filterState={pendientesFilter}
              // filterConfig={pendientesFilterConfig}
            />
          </TabsContent>
          
          <TabsContent value="historial" className="mt-4 sm:mt-6">
            <HistorialTab 
              // filterState={historialFilter}
              // filterConfig={historialFilterConfig}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}