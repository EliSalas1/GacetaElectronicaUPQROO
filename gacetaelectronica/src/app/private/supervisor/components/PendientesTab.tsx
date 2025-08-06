"use client";

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Eye, Check, X } from "lucide-react";
import { FunnelIcon } from "@heroicons/react/24/solid";
import FeedbackModal from "./FeedbackModal";
import { ViewArticleDialog } from "@/components/administrador/ViewArticleDialog";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Articulo {
  idArticulo: number; Titulo: string; categoria: string;
  FechaCreacion: string; FechaRevision?: string;
  Estatus: number; Comentario?: string; Resumen?: string; Contenido?: string;
}
interface Usuario { idUsuarios: number; Nombre: string; }
const ITEMS_PER_PAGE = 10;

export default function PendientesTab() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [autoresMap, setAutoresMap] = useState<Record<number, string>>({});
  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, articleId: 0, articleTitle: "", authorName: "" });
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"categoria" | "autor" | "fecha">("categoria");
  const [filterCategoria, setFilterCategoria] = useState("all");
  const [filterAutor, setFilterAutor] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/filtros/articulosPendientes?tipo=pendientes");
        if (!res.ok) throw new Error();
        const data: Articulo[] = await res.json();
        setArticulos(data);

        const autores = await Promise.all(data.map(async art => {
          try {
            const r = await fetch(`/api/articuloUsuario?articuloId=${art.idArticulo}`);
            const u: Usuario[] = r.ok ? await r.json() : [];
            return [art.idArticulo, u[0]?.Nombre || "Desconocido"];
          } catch { return [art.idArticulo, "Desconocido"]; }
        }));
        setAutoresMap(Object.fromEntries(autores));
      } catch { toast.error("Error al cargar artículos o autores."); }
    })();
  }, []);

  const categoriasUnicas = useMemo(() => [...new Set(articulos.map(a => a.categoria).filter(Boolean))], [articulos]);
  const autoresUnicos = useMemo(() => [...new Set(Object.values(autoresMap))], [autoresMap]);

  const filteredArticulos = useMemo(() =>
    articulos.filter(a => {
      const term = searchTerm.toLowerCase();
      const match = a.Titulo.toLowerCase().includes(term) || (autoresMap[a.idArticulo]?.toLowerCase().includes(term) ?? false);
      if (filterType === "categoria") return match && (filterCategoria === "all" || a.categoria === filterCategoria);
      if (filterType === "autor") return match && (filterAutor === "all" || autoresMap[a.idArticulo] === filterAutor);
      if (filterType === "fecha") {
        const f = new Date(a.FechaCreacion), d = filterDateFrom ? new Date(filterDateFrom) : null, h = filterDateTo ? new Date(filterDateTo) : null;
        return match && (!d || f >= d) && (!h || f <= h);
      }
      return match;
    }), [articulos, searchTerm, filterType, filterCategoria, filterAutor, filterDateFrom, filterDateTo, autoresMap]
  );


  const currentItems = filteredArticulos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  useEffect(() => setCurrentPage(1), [searchTerm, filterType, filterCategoria, filterAutor, filterDateFrom, filterDateTo]);

  const updateArticulo = async (id: number, body: any, successMsg: string) => {
    const res = await fetch(`/api/articulos?id=${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) return toast.error(await res.text());
    toast.success(successMsg);
    setArticulos(p => p.filter(a => a.idArticulo !== id));
  };

  const handleRejectArticle = (art: Articulo) =>
    !art.Comentario?.trim()
      ? setFeedbackModal({ isOpen: true, articleId: art.idArticulo, articleTitle: art.Titulo, authorName: autoresMap[art.idArticulo] ?? "Desconocido" })
      : updateArticulo(art.idArticulo, { Estatus: 2 }, `Artículo "${art.Titulo}" rechazado correctamente`);

  const handleFeedbackSubmit = async (comment: string): Promise<void> => {
    const articulo = articulos.find(a => a.idArticulo === feedbackModal.articleId);
    const body: any = { Comentario: comment };
    if (articulo && !articulo.FechaRevision) body.FechaRevision = new Date().toISOString();

    const res = await fetch(`/api/articulos?id=${feedbackModal.articleId}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
    });
    if (!res.ok) {
      toast.error(await res.text());
      return;
    }
    toast.success("Comentario agregado y fecha de revisión actualizada");
    setArticulos(prev =>
      prev.map(a =>
        a.idArticulo === feedbackModal.articleId
          ? { ...a, Comentario: comment, FechaRevision: body.FechaRevision || a.FechaRevision }
          : a
      )
    );
    setFeedbackModal({ isOpen: false, articleId: 0, articleTitle: "", authorName: "" });
  };

  const handleViewArticle = async (art: Articulo) => {
  setLoadingResources(true);

  try {
    // NUEVO: fetch desde API que devuelve todo
    const res = await fetch(`http://localhost:4000/api/articulos?id=${art.idArticulo}`);
    const data = await res.json();

    // Asignar datos al modal
    setSelectedArticle({
      title: data.Titulo,
      author: autoresMap[art.idArticulo] ?? "Desconocido",
      category: data.Categoria,
      status:
        data.status === "published"
          ? "Publicado"
          : data.status === "pending"
          ? "Pendiente"
          : "Rechazado",
      createdAt: new Date(data.createdAt).toLocaleDateString("es-ES"),
      resumen: data.Resumen,
      contenido: data.Contenido,
      id: art.idArticulo,
    });

    // Procesar recursos desde el string
    const parsedResources =
      data.Recursos?.split(",").map((url: string, i: number) => ({
        idRecurso: i + 1,
        nombre: `Recurso ${i + 1}`,
        url: url.trim(),
        tipo: "otro",
        idArticulo: art.idArticulo,
      })) ?? [];

    setResources(parsedResources);
  } catch (err) {
    console.error("Error al cargar datos del artículo", err);
    setSelectedArticle(null);
    setResources([]);
  }

  setLoadingResources(false);
  setViewDialogOpen(true);
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
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <div className="flex gap-2">
                <Input placeholder="Buscar título o autor" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-72" />
                <div className="relative flex flex-col items-end gap-2">
                  <Select value={filterType} onValueChange={v => setFilterType(v as any)}>
                    <SelectTrigger className="w-40 flex items-center gap-2"><FunnelIcon className="w-4 h-4" /><SelectValue placeholder="Filtro" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="categoria">Categoría</SelectItem><SelectItem value="autor">Autor</SelectItem><SelectItem value="fecha">Fecha de Envío</SelectItem>
                    </SelectContent>
                  </Select>
                  {filterType === "categoria" && (
                    <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                      <SelectTrigger className="w-40"><SelectValue placeholder="Categoría" /></SelectTrigger>
                      <SelectContent><SelectItem value="all">Todos</SelectItem>{categoriasUnicas.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  )}
                  {filterType === "autor" && (
                    <Select value={filterAutor} onValueChange={setFilterAutor}>
                      <SelectTrigger className="w-40"><SelectValue placeholder="Autor" /></SelectTrigger>
                      <SelectContent><SelectItem value="all">Todos</SelectItem>{autoresUnicos.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                    </Select>
                  )}
                  {filterType === "fecha" && (
                    <div className="absolute top-full right-0 mt-2 flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-md shadow-md z-10">
                      <Input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} className="w-40" />
                      <Input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} className="w-40" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="overflow-x-auto -mx-3 sm:mx-0">
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
                {currentItems.length ? currentItems.map(art => (
                  <TableRow key={art.idArticulo}>
                    <TableCell className="font-medium text-sm sm:text-base">{art.Titulo}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{autoresMap[art.idArticulo] ?? "Cargando..."}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{art.categoria || "Sin categoría"}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{new Date(art.FechaCreacion).toLocaleDateString("es-ES")}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleViewArticle(art)} className="h-8 w-8 p-0"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => updateArticulo(art.idArticulo, { Estatus: 1 }, `Artículo "${art.Titulo}" aprobado correctamente`)} className="h-8 w-8 p-0 text-green-600"><Check className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleRejectArticle(art)} className="h-8 w-8 p-0 text-red-600"><X className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No hay artículos pendientes de revisión</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={() => setFeedbackModal({ isOpen: false, articleId: 0, articleTitle: "", authorName: "" })}
        articleTitle={feedbackModal.articleTitle}
        authorName={feedbackModal.authorName}
        articleId={feedbackModal.articleId}
        onSubmit={handleFeedbackSubmit}
      />

      <ViewArticleDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        article={selectedArticle}
        resources={resources}
        loadingResources={loadingResources}
      />

    </>
  );
}
