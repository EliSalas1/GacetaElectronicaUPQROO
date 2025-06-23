"use client";

import { useState } from "react";
import { eventos } from "@/entities/article";
import EventModal from "@/components/HomeComponents/EventModal";
import { Event } from "@/entities/user";
import { CalendarDays, Clock, MapPin } from "lucide-react";

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); //Esa línea define un estado en React llamado selectedEvent que almacena un evento seleccionado o null si no hay uno activo.

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Próximos Eventos</h2>
      <div className="space-y-6">
        {eventos.map((event, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-bold mb-2">{event.titulo}</h3>

            <div className="flex items-center text-sm text-gray-600 mb-1">
              <CalendarDays className="w-4 h-4 mr-2 text-[#FF6400]" />
              {event.fecha}
            </div>

            {/** Hora */}
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Clock className="w-4 h-4 mr-2 text-[#FF6400]" />
              {event.hora}
            </div>

            {/** Lugar */}
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <MapPin className="w-4 h-4 mr-2 text-[#FF6400]" />
              {event.lugar}
            </div>

            <p className="text-sm text-gray-600 mb-3">{event.descripcion}</p>

            <button
              onClick={() => setSelectedEvent(event)}
              className="w-full border border-gray-300 text-center rounded-md py-2 text-black hover:bg-gray-100 transition text-sm font-medium"
            >
              Más información
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
