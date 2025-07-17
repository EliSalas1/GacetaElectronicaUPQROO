import Image from "next/image";

interface Props {
  type?: "login" | "signup";
}

export default function SidePanel({ type = "login" }: Props) {
  return (
    <div className="w-2/5 text-white rounded-tr-2xl py-36 px-12" style={{ backgroundColor: "var(--color-naranja)" }}>
      <div className="flex justify-center">
      <Image
        src="/2UPQROO-logo.png" alt="Logo UPQROO" width={200} height={200} className="mx-auto w-full max-w-[200px] h-auto object-contain mb-4"
      />
    </div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-fondo)" }}>
        {type === "signup" ? "¡Únete a la Gaceta UQPROO!" : "¡Bienvenido a la Gaceta UPQROO!"}
      </h2>
      <div className="border-2 w-10 border-white inline-block mb-2"></div>
      <div className="mb-10 text-justify">
        {type === "signup" ? (
          <>
            Completa el formulario para registrarte como colaborador. Si tienes dudas, escribe a{" "}
            <span className="font-bold text-white">gaceta@upqroo.edu.mx</span>
          </>
        ) : (
          <>
            Recuerda que para iniciar sesión debes usar tu cuenta institucional. Si aún no estás
            registrado, comunícate con{" "}
            <span className="font-bold text-white">gaceta@upqroo.edu.mx</span>
          </>
        )}
      </div>
    </div>
  );
}
