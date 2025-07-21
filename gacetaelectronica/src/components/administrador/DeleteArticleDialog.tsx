// components/dialogs/DeleteArticleDialog.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArticleInterface } from "@/entities/article"

interface Props {
  open: boolean
  onOpenChange: (value: boolean) => void
  article: Partial<ArticleInterface> | null
  onConfirm: () => void
}

export function DeleteArticleDialog({ open, onOpenChange, article, onConfirm }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Artículo</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar el artículo <strong>{article?.title}</strong>? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Eliminar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
