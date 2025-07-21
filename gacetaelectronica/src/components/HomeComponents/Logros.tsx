"use client";

import * as LucideIcons from "lucide-react";
import { FC, useEffect, useState } from "react";
import { LogroUs } from "@/entities/user"; // Debe tener: titulo, descripcion, icono, anio
import SkeletonSchema from "@/components/SkeletonSchema";

// Íconos y años predefinidos
const iconosDisponibles = ["Star", "CheckCheck", "BookOpenText", "Users"] as const;
const años = ["2023", "2024", "2024", "2024"];

export default function Logros() {
  const [logros, setLogros] = useState<LogroUs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogros = async () => {
      try {
        const res = await fetch("/api/logros");
        if (!res.ok) throw new Error("Error al obtener logros");
        const data = await res.json();

        const logrosAdaptados: LogroUs[] = data.map((l: any, index: number) => ({
          titulo: l.Titulo,
          descripcion: l.Descripcion,
          icono: iconosDisponibles[index % iconosDisponibles.length],
          anio: años[index % años.length],
        }));

        setLogros(logrosAdaptados);
      } catch (err) {
        console.error("Error:", err);
        setError("No se pudieron cargar los logros.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogros();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12">Nuestros Logros</h2>

        {loading && (
          <>
            <SkeletonSchema grid={4} variant="logros" />
          </>
        )}

        {!loading && (
          <div className="grid md:grid-cols-2 gap-6">
            {logros.map((logro, index) => {
              const IconComponent = LucideIcons[logro.icono] as FC<{ className?: string }>;

              return (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 flex items-center space-x-4 shadow-sm"
                >
                  <div className="w-12 h-12 bg-[#FF6400] rounded-lg flex items-center justify-center flex-shrink-0">
                    {IconComponent && <IconComponent className="w-6 h-6 text-white" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{logro.titulo}</h3>
                    <p className="text-gray-600 text-sm">{logro.descripcion}</p>
                  </div>
                  <div className="text-[#FF6400] font-bold text-lg">{logro.anio}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
