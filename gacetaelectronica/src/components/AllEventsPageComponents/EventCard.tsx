// components/HomeComponents/EventCard.tsx
"use client";

import { useState } from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Event } from "@/entities/user";
import EventModal from "@/components/HomeComponents/EventModal";

interface EventCardProps {
  event: Event;
    onClick: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-4 h-[280px] w-full flex flex-col justify-between max-w-xs mx-auto">
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
          onClick={onClick}
          className="w-full border border-gray-300 text-center rounded-md py-2 text-black hover:bg-gray-100 transition text-sm font-medium"
        >
          Más información
        </button>
      </div>
    </>
  );
}

