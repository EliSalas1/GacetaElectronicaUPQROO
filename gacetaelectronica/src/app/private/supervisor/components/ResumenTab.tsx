import { FileText, Clock, CheckCircle, XCircle } from "lucide-react"
import ResumenCard from "./ResumenCard"
import { useEffect, useState } from "react"

export default function ResumenTab() {
  const [resumen, setResumen] = useState({
    totalArticulos: 0,
    articulosPendientes: 0,
    articulosPublicados: 0,
    articulosRechazados: 0
  })

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/filtros/calculos")
        if (!res.ok) throw new Error("Error al obtener resumen")
        const data = await res.json()
        setResumen(data)
      } catch (error) {
        console.error("Error cargando datos del resumen:", error)
      }
    }

    fetchResumen()
  }, [])

  const {
    totalArticulos,
    articulosPendientes,
    articulosPublicados,
    articulosRechazados
  } = resumen

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-semibold">Resumen de Artículos</h2>
        <p className="text-gray-600 text-sm sm:text-base mt-1">
          Vista general del estado de los artículos en el sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <ResumenCard
          title="Total de Artículos"
          value={totalArticulos}
          description="Artículos totales en el sistema"
          icon={FileText}
          iconColor="text-blue-600"
        />

        <ResumenCard
          title="Pendientes de Revisión"
          value={articulosPendientes}
          description="Artículos esperando revisión"
          icon={Clock}
          iconColor="text-yellow-600"
        />

        <ResumenCard
          title="Artículos Publicados"
          value={articulosPublicados}
          description="Artículos aprobados y publicados"
          icon={CheckCircle}
          iconColor="text-green-600"
        />

        <ResumenCard
          title="Artículos Rechazados"
          value={articulosRechazados}
          description="Artículos que requieren correcciones"
          icon={XCircle}
          iconColor="text-red-600"
        />
      </div>
    </div>
  )
}
