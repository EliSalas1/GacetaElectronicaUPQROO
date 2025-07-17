"use client"

import { useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ButtomUp from "@/components/CategoriasComponents/ButtomUp"
import { eventos } from "@/entities/article"
import EventCard from "@/components/AllEventsPageComponents/EventCard"
import EventModal from "@/components/HomeComponents/EventModal"
import { Event } from "@/entities/user"

export default function AllEventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="max-w-[1280px] mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-accent-900">Todos los Eventos</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {eventos.map((event, index) => (
            <EventCard key={index} event={event} onClick={() => setSelectedEvent(event)} />
          ))}
        </div>
      </div>

      <ButtomUp />
      <Footer />

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    
    
    </div>

    
  )
}
