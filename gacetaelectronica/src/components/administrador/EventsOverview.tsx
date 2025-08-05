'use client'

import { useState, useEffect } from "react";
import { Eye, Edit, Trash2, Search, Filter } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventInterface } from "@/entities/event";
import { EditEventDialog } from "./EditEventDialog";
import { DeleteEventDialog } from "./DeleteEventDialog";
import { ViewEventDialog } from "./ViewEventDialog";
import { Spinner } from "../Spinner";
import { toast } from 'sonner'

export default function EventOverview() {
  const [selectedEvent, setSelectedEvent] = useState<EventInterface | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [events, setEvents] = useState<EventInterface[]>([]);
  const [loading, setLoading] = useState(true);

  const [page] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/eventos?limit=15&offset=${page * 15}`);
        const data = await res.json();
        const mapped = data.map((e: any) => ({
          id: e.IdEvento,
          title: e.Nombre,
          date: e.Fecha,
          time: e.Hora,
          location: e.Lugar,
          shortDescription: e.DesCorta,
          longDescription: e.DesLarga,
        }));
        setEvents(mapped);
        const totalEvents = await fetch("/api/eventos/count");
        const total = await totalEvents.json();
        totalPages
        setTotalPages(Math.ceil(total / 15));
      } catch (err) {
        console.error("Error al cargar eventos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesFilter = true;
    if (filterBy && filterValue && filterValue !== "all") {
      if (filterBy === "status") matchesFilter = event.status === filterValue;
      if (filterBy === "location") matchesFilter = event.location === filterValue;
    }
    return matchesSearch && matchesFilter;
  });

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleSaveEvent = async (updatedEvent: EventInterface) => {
    try {
      const response = await fetch(`/api/eventos?id=${updatedEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: updatedEvent.title,
          desCorta: updatedEvent.shortDescription,
          desLarga: updatedEvent.longDescription,
          fecha: updatedEvent.date,
          hora: updatedEvent.time,
          lugar: updatedEvent.location,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el evento");
      }

      const result = await response.json();
      console.log(result.message);

      setEditOpen(false);
      setEvents((prev) =>
        prev.map((event) =>
          event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event
        )
      );
    } catch (error) {
      console.error("Error al guardar el evento:", error);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      const response = await fetch(`/api/eventos?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar");
      }

      // Eliminar el evento del estado local
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));

      // Mostrar mensaje de éxito
      toast.success("Evento eliminado correctamente");
      setDeleteOpen(false); // Cerrar el modal de eliminación
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar el evento");
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div>
            <CardTitle>Todos los Eventos</CardTitle>
            <CardDescription>Vista general de los eventos registrados</CardDescription>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                className="pl-10"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={filterBy} onValueChange={(value) => { setFilterBy(value); setFilterValue(""); }}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">Estado</SelectItem>
                <SelectItem value="location">Lugar</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterValue} onValueChange={setFilterValue}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filtrar valor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {(filterBy === "status" ? ["published", "pending", "draft"] : filterBy === "location" ? Array.from(new Set(events.map((e) => e.location))) : []).map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center flex justify-center">
                <Spinner />
              </TableCell>
            </TableRow>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Lugar</TableHead>
                  <TableHead>Descripción corta</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{formatDate(event.date)}</TableCell>
                    <TableCell>{event.time}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{event.shortDescription}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedEvent(event); setViewOpen(true); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedEvent(event); setEditOpen(true); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedEvent(event); setDeleteOpen(true); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <EditEventDialog
        open={editOpen}
        onOpenChange={(value) => { setEditOpen(value); if (!value) setSelectedEvent(null); }}
        event={selectedEvent}
        onSave={handleSaveEvent}
      />

      <DeleteEventDialog
        open={deleteOpen}
        onOpenChange={(value) => { setDeleteOpen(value); if (!value) setSelectedEvent(null); }}
        event={selectedEvent}
        onConfirm={handleDeleteEvent}
      />

      <ViewEventDialog
        open={viewOpen}
        onOpenChange={(value) => { setViewOpen(value); if (!value) setSelectedEvent(null); }}
        event={selectedEvent}
      />
    </>
  );
}
