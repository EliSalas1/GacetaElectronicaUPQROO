import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/globals.css";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Header />
        <main className="px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
