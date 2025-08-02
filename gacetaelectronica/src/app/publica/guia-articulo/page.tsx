"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GuiaArticulosContainer } from "./components/container";

export default function GuiaArticuloPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F9FC] py-10 px-4">
        <GuiaArticulosContainer />
      </main>
      <Footer />
    </>
  );
}
