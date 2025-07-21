"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ReactNode } from "react"

interface DialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  trigger?: ReactNode
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}
export default function CustomDialog({ isOpen, setIsOpen, trigger, title, description, children, footer }: DialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="space-y-4">{children}</div>
        {footer && <div className="pt-4">{footer}</div>}
      </DialogContent>
    </Dialog>
  )
}
