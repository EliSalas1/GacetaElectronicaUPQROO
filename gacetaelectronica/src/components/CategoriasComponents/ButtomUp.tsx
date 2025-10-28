"use client"

import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ButtomUp() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
  <Button
    onClick={scrollToTop}
    className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg z-50"
    size="icon"
  >
    <ArrowUp className="w-5 h-5 text-black" />
  </Button>
);

}
