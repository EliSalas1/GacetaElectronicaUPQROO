import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, Send } from "lucide-react";
import { toast } from "sonner";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleTitle: string;
  authorName: string;
  articleId: number;
}

export default function FeedbackModal({
  isOpen,
  onClose,
  articleTitle,
  authorName,
  articleId,
}: FeedbackModalProps) {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error("Por favor, escribe un comentario antes de enviar");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implementar envío de feedback a la base de datos
      // - Crear endpoint API para guardar el feedback del supervisor
      // - Actualizar el estado del artículo a "rechazado" con feedback
      // - Enviar notificación por email al autor del artículo
      // - Registrar la acción en el historial de cambios del artículo

      // Simulamos una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(`Enviando feedback para artículo ${articleId}:`, {
        articleId,
        feedback: feedback.trim(),
        supervisorAction: "reject",
        timestamp: new Date().toISOString(),
      });

      toast.success(`Feedback enviado exitosamente a ${authorName}`);
      setFeedback("");
      onClose();
    } catch (error) {
      console.error("Error al enviar feedback:", error);
      toast.error("Error al enviar el feedback. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFeedback("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-w-[95vw] mx-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
            <DialogTitle className="text-lg sm:text-xl leading-tight">
              Rechazar Artículo
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm sm:text-base">
            Proporciona feedback constructivo para ayudar al autor a mejorar su
            artículo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Información del artículo */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2">
            <div>
              <Label className="text-xs sm:text-sm font-medium text-gray-600">
                Artículo:
              </Label>
              <p className="text-sm sm:text-base font-medium mt-1 break-words">
                {articleTitle}
              </p>
            </div>
            <div>
              <Label className="text-xs sm:text-sm font-medium text-gray-600">
                Autor:
              </Label>
              <p className="text-sm sm:text-base mt-1">{authorName}</p>
            </div>
          </div>

          {/* Campo de feedback */}
          <div className="space-y-2">
            <Label
              htmlFor="feedback"
              className="text-sm sm:text-base font-medium"
            >
              Comentarios y sugerencias <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="feedback"
              placeholder="Describe las razones del rechazo y proporciona sugerencias específicas para mejorar el artículo..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[120px] resize-none text-sm sm:text-base"
              disabled={isSubmitting}
            />
            <p className="text-xs sm:text-sm text-gray-500">
              {feedback.length}/500 caracteres
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !feedback.trim()}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Feedback
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
