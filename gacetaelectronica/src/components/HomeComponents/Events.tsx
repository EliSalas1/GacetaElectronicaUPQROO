"use client";

import { useState, useEffect } from "react";
import EventModal from "@/components/HomeComponents/EventModal";
import { Event } from "@/entities/user";
import { CalendarDays, Clock, MapPin } from "lucide-react";

export default function Events() {
  const [eventos, setEventos] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const res = await fetch("/api/eventos");
        if (!res.ok) {
          const contentType = res.headers.get("content-type");
          const errorText = contentType?.includes("application/json")
            ? await res.json()
            : await res.text();
          console.error("Error del backend:", errorText);
          setError("Ocurrió un error al obtener los eventos.");
          setLoading(false);
          return;
        }

        const data = await res.json();

        const eventosAdaptados: Event[] = data.map((e: any) => {
          const rawFecha = new Date(e.Fecha);
          const rawHora = e.Hora;

          const fechaFormateada = rawFecha.toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

          const horaFormateada = new Date(`1970-01-01T${rawHora}`).toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          return {
            id: e.IdEvento || 0,
            titulo: e.Nombre || "",
            fecha: fechaFormateada,
            hora: horaFormateada,
            lugar: e.Lugar || "",
            descripcion: e.DesCorta ?? e.DesLarga ?? "",
            descripcion_larga: e.DesLarga ?? "",
          };
        });

        setEventos(eventosAdaptados);
        setLoading(false);
      } catch (err) {
        console.error("Error al conectar con el servidor:", err);
        setError("No se pudo conectar al servidor.");
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

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

      {/* Loading / Error */}
      {loading && <p className="text-sm text-gray-600">Cargando eventos...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Eventos */}
      {!loading && !error && (
        <div className="space-y-6">
          {eventos.map((event, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-bold mb-2">{event.titulo}</h3>

              <div className="flex items-center text-sm text-gray-600 mb-1">
                <CalendarDays className="w-4 h-4 mr-2 text-[#FF6400]" />
                {event.fecha}
              </div>

              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Clock className="w-4 h-4 mr-2 text-[#FF6400]" />
                {event.hora}
              </div>

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
      )}

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
