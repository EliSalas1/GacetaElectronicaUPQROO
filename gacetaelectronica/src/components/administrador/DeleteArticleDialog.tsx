'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Articulo {
  IdArticulo: number
  Titulo: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  article: Articulo | null
  onDeleted: () => void
}

export function DeleteArticleDialog({ open, onOpenChange, article, onDeleted }: Props) {
  if (!article) return null

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/articulos?id=${article.IdArticulo}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Error al eliminar artículo')
      }

      toast.success('Artículo eliminado correctamente')
      onDeleted()
      onOpenChange(false)
    } catch (error: any) {
      toast.error('Error al eliminar artículo: ' + error.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>¿Eliminar artículo?</DialogTitle>
        </DialogHeader>
        <p>
          ¿Estás seguro de que deseas eliminar el artículo <strong>&quot;{article.Titulo}&quot;</strong>? Esta acción no se puede deshacer.
        </p>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
