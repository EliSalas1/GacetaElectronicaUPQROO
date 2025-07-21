import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ButtomUp from "@/components/CategoriasComponents/ButtomUp";

export default function LayoutCategorias({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main className="max-w-[1280px] mx-auto py-8">{children}</main>
      <ButtomUp />
      <Footer />
    </div>
  );
}
