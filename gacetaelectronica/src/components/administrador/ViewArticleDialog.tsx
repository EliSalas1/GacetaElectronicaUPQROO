"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArticleInterface } from "@/entities/article"

type Props = {
  open: boolean
  onOpenChange: (value: boolean) => void
  article: Partial<ArticleInterface> | null
}

export function ViewArticleDialog({ open, onOpenChange, article }: Props) {
  if (!article) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Información del Artículo</DialogTitle>
          <DialogDescription>
            Todos los detalles del artículo seleccionado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <p><strong>Título:</strong> {article.title}</p>
          <p><strong>Autor:</strong> {article.author}</p>
          <p><strong>Categoría:</strong> {article.category}</p>
          <p><strong>Estado:</strong> {article.status}</p>
          <p><strong>Fecha de Creación:</strong> {article.createdAt}</p>
          <p><strong>Resumen:</strong> {article.resumen}</p> {/* Aquí agregamos el resumen */}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
