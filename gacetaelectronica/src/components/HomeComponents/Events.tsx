"use client";

import { useState } from "react";
import { eventos } from "@/entities/article";
import EventModal from "@/components/HomeComponents/EventModal";
import { Event } from "@/entities/user";
import { CalendarDays, Clock, MapPin } from "lucide-react";
// import { Button } from "@/components/ui/button";


export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Próximos Eventos</h2>

        {/* <Button
          asChild
          variant="outline"
          className="ml-4 bg-white text-[#4C0000] border border-[#4C0000] hover:bg-[#4C0000] hover:text-white text-sm px-3 py-1 h-auto"
        >
          <a href="/publica/alleventpage" className="flex items-center gap-2">
            Ver todos →
          </a>
        </Button> */}
      </div>

      {/* Separador debajo del header */}

      {/* Eventos */}
      <div className="space-y-6">
        {eventos.map((event, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-bold mb-2">{event.titulo}</h3>

            {/* Fecha */}
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <CalendarDays className="w-4 h-4 mr-2 text-[#FF6400]" />
              {event.fecha}
            </div>

            {/* Hora */}
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Clock className="w-4 h-4 mr-2 text-[#FF6400]" />
              {event.hora}
            </div>

            {/* Lugar */}
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <MapPin className="w-4 h-4 mr-2 text-[#FF6400]" />
              {event.lugar}
            </div>

            <p className="text-sm text-gray-600 mb-3">
              {event.descripcion}
            </p>

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
