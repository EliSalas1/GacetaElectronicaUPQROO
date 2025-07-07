import { GuiaArticulosContainer } from "./components/container";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function GuiaArticulo() {
  return (
    <>
      <Header />
      <div>
        <GuiaArticulosContainer />
      </div>
      <Footer />
    </>
  );
}