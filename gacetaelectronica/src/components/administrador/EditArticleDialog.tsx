"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { ArticleInterface } from "@/entities/article";

interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  article: Partial<ArticleInterface> | null;
  onSave: (updatedArticle: Partial<ArticleInterface>) => void;
}

export function EditArticleDialog({ open, onOpenChange, article, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (article) {
      setTitle(article.title || "");
      setCategory(article.category || "");
      setStatus(article.status || "");
    }
  }, [article]);

  const handleSubmit = () => {
    if (!article) return;
    onSave({
      id: article.id,
      title,
      category,
      status,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Artículo</DialogTitle>
          <DialogDescription>Edita el título, categoría y estado del artículo.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Publicado</SelectItem>
                <SelectItem value="pending">En Revisión</SelectItem>
                <SelectItem value="unknown">Desconocido</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!title || !category || !status}
          >
            Guardar Cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
