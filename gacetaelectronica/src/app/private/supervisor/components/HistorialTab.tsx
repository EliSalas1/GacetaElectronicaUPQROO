"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FunnelIcon } from "@heroicons/react/24/solid";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface ArticuloHistorial {
  idArticulo: number;
  Titulo: string;
  FechaCreacion: string;
  Estatus: number;
  Comentario?: string;
}
interface Usuario {
  idUsuarios: number;
  Nombre: string;
}
const ITEMS_PER_PAGE = 10;

export default function HistorialTab() {
  const [articulos, setArticulos] = useState<ArticuloHistorial[]>([]);
  const [autoresMap, setAutoresMap] = useState<Record<number, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"decision" | "autor" | "fecha">("decision");
  const [filterDecision, setFilterDecision] = useState("all");
  const [filterAutor, setFilterAutor] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/filtros/articulosPendientes?tipo=Otros");
        if (!res.ok) throw new Error();
        const data: ArticuloHistorial[] = await res.json();
        setArticulos(data);

        const autoresEntries = await Promise.all(
          data.map(async (art) => {
            try {
              const resUsuarios = await fetch(`/api/articuloUsuario?articuloId=${art.idArticulo}`);
              if (!resUsuarios.ok) throw new Error();
              const usuarios: Usuario[] = await resUsuarios.json();
              return [art.idArticulo, usuarios[0]?.Nombre || "Desconocido"] as [number, string];
            } catch {
              return [art.idArticulo, "Desconocido"] as [number, string];
            }
          })
        );
        setAutoresMap(Object.fromEntries(autoresEntries));
      } catch {
        toast.error("Error al cargar historial.");
      }
    })();
  }, []);

  const autoresUnicos = useMemo(() => [...new Set(Object.values(autoresMap))], [autoresMap]);

  const filteredArticulos = articulos.filter((a) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      a.Titulo.toLowerCase().includes(term) ||
      (autoresMap[a.idArticulo]?.toLowerCase().includes(term) ?? false) ||
      (a.Comentario?.toLowerCase().includes(term) ?? false);

    if (filterType === "decision")
      return (
        matchSearch &&
        (filterDecision === "all" ||
          (filterDecision === "publicado" && a.Estatus === 1) ||
          (filterDecision === "rechazado" && a.Estatus === 2))
      );
    if (filterType === "autor")
      return matchSearch && (filterAutor === "all" || autoresMap[a.idArticulo] === filterAutor);
    if (filterType === "fecha") {
      const fecha = new Date(a.FechaCreacion);
      const desde = filterDateFrom ? new Date(filterDateFrom) : null;
      const hasta = filterDateTo ? new Date(filterDateTo) : null;
      return matchSearch && (!desde || fecha >= desde) && (!hasta || fecha <= hasta);
    }
    return matchSearch;
  });

  const totalPages = Math.ceil(filteredArticulos.length / ITEMS_PER_PAGE);
  const currentItems = filteredArticulos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => setCurrentPage(1), [searchTerm, filterType, filterDecision, filterAutor, filterDateFrom, filterDateTo]);

  const getDecisionBadge = (estatus: number) => (
    <Badge
      variant={estatus === 1 ? "default" : "destructive"}
      className={estatus === 1 ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200"}
    >
      {estatus === 1 ? "Publicado" : "Rechazado"}
    </Badge>
  );

  return (
    <Card>
      <CardHeader className="px-3 sm:px-6 py-3 sm:py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-lg sm:text-xl">Historial de Revisiones</CardTitle>
            <CardDescription className="text-sm sm:text-base mt-1">
              Registro de artículos revisados.
              <span className="block sm:inline sm:ml-2 text-xs sm:text-sm font-medium">
                Mostrando {filteredArticulos.length} artículos en total
              </span>
            </CardDescription>
          </div>

          {/* Controles */}
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <div className="flex gap-2">
              <Input
                placeholder="Buscar título, autor o comentario"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-72"
                spellCheck={false}
              />

              {/* Selector principal con dependiente */}
              <div className="relative flex flex-col items-end gap-2">
                <Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
                  <SelectTrigger className="w-40 flex items-center gap-2">
                    <FunnelIcon className="w-4 h-4" />
                    <SelectValue placeholder="Filtro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="decision">Decisión</SelectItem>
                    <SelectItem value="autor">Autor</SelectItem>
                    <SelectItem value="fecha">Fecha de revisión</SelectItem>
                  </SelectContent>
                </Select>

                {filterType === "decision" && (
                  <Select value={filterDecision} onValueChange={setFilterDecision}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Decisión" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="publicado">Publicado</SelectItem>
                      <SelectItem value="rechazado">Rechazado</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                {filterType === "autor" && (
                  <Select value={filterAutor} onValueChange={setFilterAutor}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Autor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {autoresUnicos.map((autor) => (
                        <SelectItem key={autor} value={autor}>
                          {autor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {filterType === "fecha" && (
                  <div className="absolute top-full right-0 mt-2 flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-md shadow-md z-10">
                    <Input
                      type="date"
                      value={filterDateFrom}
                      onChange={(e) => setFilterDateFrom(e.target.value)}
                      className="w-40"
                    />
                    <Input
                      type="date"
                      value={filterDateTo}
                      onChange={(e) => setFilterDateTo(e.target.value)}
                      className="w-40"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Título</TableHead>
                  <TableHead className="hidden sm:table-cell">Autor</TableHead>
                  <TableHead className="hidden md:table-cell">Fecha</TableHead>
                  <TableHead className="hidden lg:table-cell">Decisión</TableHead>
                  <TableHead className="hidden xl:table-cell max-w-xs">Retroalimentación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length ? (
                  currentItems.map((a) => (
                    <TableRow key={a.idArticulo}>
                      <TableCell className="font-medium text-sm sm:text-base">{a.Titulo}</TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">{autoresMap[a.idArticulo] ?? "Cargando..."}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {new Date(a.FechaCreacion).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{getDecisionBadge(a.Estatus)}</TableCell>
                      <TableCell className="hidden xl:table-cell max-w-xs text-sm truncate" title={a.Comentario || "Sin comentarios"}>
                        {a.Comentario || "Sin comentarios"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No se encontraron artículos que coincidan con los filtros aplicados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-end mt-4 gap-2">
            <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
              Anterior
            </Button>
            <span className="text-sm flex items-center">
              Página {currentPage} de {totalPages}
            </span>
            <Button size="sm" variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
              Siguiente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
