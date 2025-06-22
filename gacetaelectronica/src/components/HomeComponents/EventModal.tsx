"use client";

import { X, CalendarDays, Clock, MapPin } from "lucide-react";
import { Event } from "@/entities/user";

// Definimos las props esperadas del componente
interface EventModalProps {
  event: Event;         // Información del evento que se mostrará
  onClose: () => void;  // Función para cerrar el modal
}

export default function EventModal({ event, onClose }: EventModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Título */}
        <h2 className="text-xl font-bold mb-6">{event.titulo}</h2>

        {/* Datos del evento */}
        <div className="text-sm text-gray-700 space-y-4">
          <p className="flex items-center">
            <CalendarDays className="w-4 h-4 mr-2 text-[#FF6400]" />
            <strong className="mr-1">Fecha:</strong> {event.fecha}
          </p>

          <p className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-[#FF6400]" />
            <strong className="mr-1">Hora:</strong> {event.hora}
          </p>

          <p className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-[#FF6400]" />
            <strong className="mr-1">Lugar:</strong> {event.lugar}
          </p>

          {/* Descripción larga */}
          <p className="text-gray-600 leading-relaxed whitespace-pre-line pt-2">
            {event.descripcion_larga || event.descripcion}
          </p>
        </div>
      </div>
    </div>
  );
}
