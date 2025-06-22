"use client";

import * as LucideIcons from "lucide-react";
import { logros } from "@/entities/article";
import { LogroUs } from "@/entities/user";
import { FC } from "react";

// Mapeo entre los valores posibles del campo "icono" del tipo LogroUs y los íconos reales disponibles en la librería LucideIcons
const iconMap: Record<LogroUs["icono"], keyof typeof LucideIcons> = {
  Star: "Star",
  CheckCheck: "CheckCheck",
  BookOpenText: "BookOpenText",
  Users: "Users",
};

export default function Logros() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12">Nuestros Logros</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {logros.map((logro, index) => {
            const iconName = iconMap[logro.icono];
            const IconComponent = LucideIcons[iconName] as FC<{ className?: string }>;

            return (
              <div
                key={index}
                className="bg-white rounded-lg p-6 flex items-center space-x-4 shadow-sm"
              >
                <div className="w-12 h-12 bg-[#FF6400] rounded-lg flex items-center justify-center flex-shrink-0">
                  {IconComponent && <IconComponent className="w-6 h-6 text-white" />}
                </div>
                <div className="flex-1">
                  {/* {} optiene la informacion de article */}
                  <h3 className="font-bold text-lg text-gray-900">{logro.titulo}</h3>
                  <p className="text-gray-600 text-sm">{logro.descripcion}</p>
                </div>
                <div className="text-[#FF6400] font-bold text-lg">{logro.anio}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
