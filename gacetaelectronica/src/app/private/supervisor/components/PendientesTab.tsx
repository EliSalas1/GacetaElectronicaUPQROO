"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Check, X } from "lucide-react";
import { FunnelIcon } from "@heroicons/react/24/solid";
import FeedbackModal from "./FeedbackModal";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Articulo {
  idArticulo: number;
  Titulo: string;
  categoria: string;
  FechaCreacion: string;
  Estatus: number;
  Comentario?: string;
}
interface Usuario {
  idUsuarios: number;
  Nombre: string;
}

const ITEMS_PER_PAGE = 10;

export default function PendientesTab({ onViewArticle }: { onViewArticle?: (id: number) => void }) {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [autoresMap, setAutoresMap] = useState<Record<number, string>>({});
  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    articleId: 0,
    articleTitle: "",
    authorName: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"categoria" | "autor" | "fecha">("categoria");
  const [filterCategoria, setFilterCategoria] = useState("all");
  const [filterAutor, setFilterAutor] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/filtros/articulosPendientes?tipo=pendientes");
        if (!res.ok) throw new Error("Error al obtener artículos");
        const data: Articulo[] = await res.json();
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
        toast.error("Error al cargar artículos o autores.");
      }
    })();
  }, []);

  const categoriasUnicas = useMemo(() => [...new Set(articulos.map((a) => a.categoria).filter(Boolean))], [articulos]);
  const autoresUnicos = useMemo(() => [...new Set(Object.values(autoresMap))], [autoresMap]);

  const filteredArticulos = articulos.filter((a) => {
    const term = searchTerm.toLowerCase();
    const matchSearch = a.Titulo.toLowerCase().includes(term) || (autoresMap[a.idArticulo]?.toLowerCase().includes(term) ?? false);

    if (filterType === "categoria") return matchSearch && (filterCategoria === "all" || a.categoria === filterCategoria);
    if (filterType === "autor") return matchSearch && (filterAutor === "all" || autoresMap[a.idArticulo] === filterAutor);
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

  useEffect(() => setCurrentPage(1), [searchTerm, filterType, filterCategoria, filterAutor, filterDateFrom, filterDateTo]);

  const handleApproveArticle = async (id: number, title: string) => {
    try {
      const res = await fetch(`/api/articulos?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Estatus: 1 }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Artículo "${title}" aprobado correctamente`);
      setArticulos((p) => p.filter((a) => a.idArticulo !== id));
    } catch {
      toast.error("Error al aprobar el artículo.");
    }
  };

  const handleRejectArticle = (art: Articulo) => {
    if (!art.Comentario || art.Comentario.trim() === "") {
      setFeedbackModal({
        isOpen: true,
        articleId: art.idArticulo,
        articleTitle: art.Titulo,
        authorName: autoresMap[art.idArticulo] ?? "Desconocido",
      });
    } else {
      rejectWithStatus(art.idArticulo, art.Titulo);
    }
  };

  const rejectWithStatus = async (id: number, title: string) => {
    try {
      const res = await fetch(`/api/articulos?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Estatus: 2 }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Artículo "${title}" rechazado correctamente`);
      setArticulos((p) => p.filter((a) => a.idArticulo !== id));
    } catch {
      toast.error("Error al rechazar el artículo.");
    }
  };

  const handleFeedbackSubmit = async (comment: string) => {
    try {
      const res = await fetch(`/api/articulos?id=${feedbackModal.articleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Comentario: comment }),
      });
      if (!res.ok) throw new Error();
      toast.success("Comentario agregado al artículo (estatus sin cambios)");
      setArticulos((prev) =>
        prev.map((a) =>
          a.idArticulo === feedbackModal.articleId ? { ...a, Comentario: comment } : a
        )
      );
    } catch {
      toast.error("Error al enviar el comentario.");
    } finally {
      setFeedbackModal({ isOpen: false, articleId: 0, articleTitle: "", authorName: "" });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="px-3 sm:px-6 py-3 sm:py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Artículos Pendientes de Revisión</CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Artículos que requieren revisión y aprobación del supervisor.
                <span className="block sm:inline sm:ml-2 text-xs sm:text-sm font-medium">
                  Mostrando {filteredArticulos.length} artículos en total
                </span>
              </CardDescription>
            </div>

            {/* Filtros */}
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar título o autor"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-72"
                  spellCheck={false}
                />
                <div className="relative flex flex-col items-end gap-2">
                  <Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
                    <SelectTrigger className="w-40 flex items-center gap-2">
                      <FunnelIcon className="w-4 h-4" />
                      <SelectValue placeholder="Filtro" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="categoria">Categoría</SelectItem>
                      <SelectItem value="autor">Autor</SelectItem>
                      <SelectItem value="fecha">Fecha de Envío</SelectItem>
                    </SelectContent>
                  </Select>

                  {filterType === "categoria" && (
                    <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                      <SelectTrigger className="w-40"><SelectValue placeholder="Categoría" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {categoriasUnicas.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {filterType === "autor" && (
                    <Select value={filterAutor} onValueChange={setFilterAutor}>
                      <SelectTrigger className="w-40"><SelectValue placeholder="Autor" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {autoresUnicos.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                  {filterType === "fecha" && (
                    <div className="absolute top-full right-0 mt-2 flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-md shadow-md z-10">
                      <Input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} className="w-40" />
                      <Input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} className="w-40" />
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
                    <TableHead className="min-w-[200px] sm:min-w-0">Título</TableHead>
                    <TableHead className="hidden sm:table-cell">Autor</TableHead>
                    <TableHead className="hidden md:table-cell">Categoría</TableHead>
                    <TableHead className="hidden lg:table-cell">Fecha de Envío</TableHead>
                    <TableHead className="text-center w-24 sm:w-32">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length ? currentItems.map((art) => (
                    <TableRow key={art.idArticulo}>
                      <TableCell className="font-medium text-sm sm:text-base">{art.Titulo}</TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">{autoresMap[art.idArticulo] ?? "Cargando..."}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{art.categoria || "Sin categoría"}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{new Date(art.FechaCreacion).toLocaleDateString("es-ES")}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => onViewArticle?.(art.idArticulo)} className="h-8 w-8 p-0" title="Ver artículo"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleApproveArticle(art.idArticulo, art.Titulo)} className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50" title="Aprobar artículo"><Check className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleRejectArticle(art)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50" title="Rechazar artículo"><X className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No hay artículos pendientes de revisión</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {feedbackModal.isOpen && (
        <FeedbackModal
          isOpen={feedbackModal.isOpen}
          onClose={() => setFeedbackModal({ isOpen: false, articleId: 0, articleTitle: "", authorName: "" })}
          articleTitle={feedbackModal.articleTitle}
          authorName={feedbackModal.authorName}
          articleId={feedbackModal.articleId}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </>
  );
}
