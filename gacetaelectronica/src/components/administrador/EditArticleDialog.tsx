'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface Articulo {
  IdArticulo: number
  Titulo: string
  Resumen: string
  Contenido: string
  IdCategoria: number
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  article: Articulo | null
  onUpdated: () => void
}

export function EditArticleDialog({ open, onOpenChange, article, onUpdated }: Props) {
  const [titulo, setTitulo] = useState('')
  const [resumen, setResumen] = useState('')
  const [contenido, setContenido] = useState('')

  useEffect(() => {
    if (article) {
      setTitulo(article.Titulo)
      setResumen(article.Resumen)
      setContenido(article.Contenido)
    }
  }, [article])

  if (!article) return null

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/articulos?id=${article.IdArticulo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Titulo: titulo,
          Resumen: resumen,
          Contenido: contenido
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Error al actualizar artículo')
      }

      toast.success('Artículo actualizado correctamente')
      onUpdated()
      onOpenChange(false)
    } catch (error: any) {
      toast.error('Error al guardar cambios: ' + error.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar artículo</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <Textarea
            placeholder="Resumen"
            value={resumen}
            onChange={(e) => setResumen(e.target.value)}
          />
          <Textarea
            placeholder="Contenido"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            rows={6}
          />
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
