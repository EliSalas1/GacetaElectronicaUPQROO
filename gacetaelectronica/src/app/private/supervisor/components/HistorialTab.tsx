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
import { useEffect, useState } from "react";
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
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch artículos revisados y autores
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/filtros/articulosPendientes?tipo=Otros");
        if (!res.ok) throw new Error("Error al obtener artículos");
        const data: ArticuloHistorial[] = await res.json();
        setArticulos(data);

        const autoresEntries = await Promise.all(
          data.map(async (art) => {
            try {
              const resUsuarios = await fetch(`/api/articuloUsuario?articuloId=${art.idArticulo}`);
              if (!resUsuarios.ok) throw new Error("No se pudo obtener autor");
              const usuarios: Usuario[] = await resUsuarios.json();
              return [art.idArticulo, usuarios[0]?.Nombre || "Desconocido"] as [number, string];
            } catch {
              return [art.idArticulo, "Desconocido"] as [number, string];
            }
          })
        );

        setAutoresMap(Object.fromEntries(autoresEntries));
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar historial.");
      }
    }
    fetchData();
  }, []);

  const getDecisionBadge = (estatus: number) => {
    const isPublicado = estatus === 1;
    return (
      <Badge
        variant={isPublicado ? "default" : "destructive"}
        className={
          isPublicado
            ? "bg-green-100 text-green-800 hover:bg-green-200"
            : "bg-red-100 text-red-800 hover:bg-red-200"
        }
      >
        {isPublicado ? "Publicado" : "Rechazado"}
      </Badge>
    );
  };

  // Filtrar artículos
  const filteredArticulos = articulos.filter((articulo) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      articulo.Titulo.toLowerCase().includes(term) ||
      (autoresMap[articulo.idArticulo]?.toLowerCase().includes(term) ?? false) ||
      (articulo.Comentario?.toLowerCase().includes(term) ?? false);

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "publicado" && articulo.Estatus === 1) ||
      (filterStatus === "rechazado" && articulo.Estatus === 2);

    return matchesSearch && matchesStatus;
  });

  // Paginación
  const totalPages = Math.ceil(filteredArticulos.length / ITEMS_PER_PAGE);
  const currentItems = filteredArticulos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Resetear a página 1 si cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

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
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Input
              placeholder="Buscar por título, autor o comentario"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-72"
              spellCheck={false}
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filtrar por decisión" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="publicado">Publicado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
              </SelectContent>
            </Select>
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
                {currentItems.length > 0 ? (
                  currentItems.map((articulo) => (
                    <TableRow key={articulo.idArticulo}>
                      <TableCell className="font-medium text-sm sm:text-base">
                        {articulo.Titulo}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">
                        {autoresMap[articulo.idArticulo] ?? "Cargando..."}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {new Date(articulo.FechaCreacion).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {getDecisionBadge(articulo.Estatus)}
                      </TableCell>
                      <TableCell
                        className="hidden xl:table-cell max-w-xs text-sm truncate"
                        title={articulo.Comentario || "Sin comentarios"}
                      >
                        {articulo.Comentario || "Sin comentarios"}
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

        {/* Controles de paginación */}
        {totalPages > 1 && (
          <div className="flex justify-end mt-4 gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Anterior
            </Button>
            <span className="text-sm flex items-center">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Siguiente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
