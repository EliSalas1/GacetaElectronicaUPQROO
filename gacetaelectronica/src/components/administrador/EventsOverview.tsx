"use client";

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
import { useFetch } from "@/hooks/useFetch";
import { Spinner } from "../Spinner";
import FilterSearchBar from "../FilterSearchBar";

export default function EventOverview() {
  const [selectedEvent, setSelectedEvent] = useState<EventInterface | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [events, setEvents] = useState<EventInterface[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados del filtro
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/eventos");
        const data = await res.json();
        // Mapear los campos del API a tu interfaz
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
      } catch (err) {
        console.error("Error al cargar eventos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Filtrado local
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

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div>
            <CardTitle>Todos los Eventos</CardTitle>
            <CardDescription>Vista general de los eventos registrados</CardDescription>
          </div>

          {/* Filtros inline */}
          <div className="flex gap-2 w-full md:w-auto">
            {/* Input búsqueda */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                className="pl-10"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtro por campo */}
            <Select
              value={filterBy}
              onValueChange={(value) => {
                setFilterBy(value);
                setFilterValue("");
              }}
            >
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">Estado</SelectItem>
                <SelectItem value="location">Lugar</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro por valor */}
            <Select value={filterValue} onValueChange={setFilterValue}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filtrar valor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {(filterBy === "status"
                  ? ["published", "pending", "draft"]
                  : filterBy === "location"
                  ? Array.from(new Set(events.map((e) => e.location)))
                  : []
                ).map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedEvent(event);
                            setViewOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedEvent(event);
                            setEditOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedEvent(event);
                            setDeleteOpen(true);
                          }}
                        >
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
        onOpenChange={(value) => {
          setEditOpen(value);
          if (!value) setSelectedEvent(null);
        }}
        event={selectedEvent}
        onSave={async (updatedEvent) => {
          try {
            const res = await fetch(`/api/eventos?id=${updatedEvent.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                Nombre: updatedEvent.title,
                Fecha: updatedEvent.date,
                Hora: updatedEvent.time,
                Lugar: updatedEvent.location,
                DesCorta: updatedEvent.shortDescription,
                DesLarga: updatedEvent.longDescription,
              }),
            });
            if (!res.ok) throw new Error("Error al actualizar evento");
            setEvents((prev) =>
              prev.map((e) =>
                e.id === updatedEvent.id ? { ...e, ...updatedEvent } : e
              )
            );
          } catch (err) {
            console.error(err);
            alert("Error al guardar cambios del evento");
          }
        }}
      />

      <DeleteEventDialog
        open={deleteOpen}
        onOpenChange={(value) => {
          setDeleteOpen(value);
          if (!value) setSelectedEvent(null);
        }}
        event={selectedEvent}
        onConfirm={async () => {
          try {
            const res = await fetch(`/api/eventos?id=${selectedEvent?.id}`, {
              method: "DELETE",
            });
            if (!res.ok) throw new Error("Error al eliminar evento");
            setEvents((prev) => prev.filter((e) => e.id !== selectedEvent?.id));
          } catch (err) {
            console.error(err);
            alert("Error al eliminar evento");
          } finally {
            setDeleteOpen(false);
          }
        }}
      />

      <ViewEventDialog
        open={viewOpen}
        onOpenChange={(value) => {
          setViewOpen(value);
          if (!value) setSelectedEvent(null);
        }}
        event={selectedEvent}
      />
    </>
  );
}
