"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArticleInterface } from "@/entities/article";
import { ResourceInterface } from "@/entities/resources";


type Props = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  article: Partial<ArticleInterface> | null;
  resources: ResourceInterface[]; // O usa un tipo mejor si lo tienes, como ResourceInterface[]
  loadingResources: boolean;
};

export function ViewArticleDialog({ open, onOpenChange, article, resources, loadingResources }: Props) {
  if (!article) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto"> */}
      {/* <DialogContent className="w-full max-w-[30%] sm:max-w-[50rem] max-h-[90vh] overflow-y-auto px-6"> */}
      <DialogContent className="w-full max-w-[40%] sm:max-w-[60rem] max-h-[90vh] overflow-y-auto px-6">
        <DialogHeader>
          <DialogTitle>Información del Artículo</DialogTitle>
          <DialogDescription>
            Todos los detalles del artículo seleccionado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 px-1 py-2">
          {/* 🔹 Metadatos */}
          <section className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-2 text-orange-800">Datos Generales</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <p><strong>Título:</strong> {article.title}</p>
              <p><strong>Autor:</strong> {article.author}</p>
              <p><strong>Categoría:</strong> {article.category}</p>
              <p><strong>Estado:</strong> {article.status}</p>
              <p><strong>Fecha de Creación:</strong> {article.createdAt}</p>
            </div>
          </section>

          {/* 🔹 Resumen */}
          <section className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-2 text-orange-800">Resumen</h3>
            <p className="text-sm text-justify">{article.resumen}</p>
          </section>


        </div>
        <div className="space-y-4 mt-4">
          {/* 🔹 Contenido completo */}
          <section>
            <h3 className="font-semibold text-lg mb-2 text-orange-800">Contenido Completo</h3>
            {article?.contenido ? (
              <div
                className="prose max-w-none text-sm"
                style={{ whiteSpace: "pre-line", textAlign: "justify" }}
                dangerouslySetInnerHTML={{ __html: article.contenido }}
              />
            ) : (
              <p className="text-sm text-gray-500">Sin contenido disponible</p>
            )}
          </section>

          {/* Recursos asociados */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Recursos vinculados</h3>
            {loadingResources ? (
              <p className="text-gray-500 text-sm">Cargando recursos...</p>
            ) : resources?.length === 0 ? (
              <p className="text-sm text-gray-500">Sin recursos asociados.</p>
            ) : (
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-600">
                {resources.map((resource) => (
                  <li key={resource.idRecurso}>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {resource.nombre || resource.url}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}