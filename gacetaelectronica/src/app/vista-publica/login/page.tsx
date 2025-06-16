import { FaGoogle, FaRegEnvelope } from 'react-icons/fa';
import { MdLockOutline } from 'react-icons/md';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2" style={{ backgroundColor: "var(--color-fondo)" }}>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
          <div className="w-3/5 p-5">
            {/* Login Section */}
            <div className="py-10">
              <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--color-vino)" }}>
                Iniciar Sesión
              </h2>
              <div className="border-2 w-10 inline-block mb-2" style={{ borderColor: "var(--color-naranja)" }}></div>
              <div className="flex justify-center my-2">
                <a href="#" className="border-2 border-gray-200 rounded-full p-3 mx-1">
                  <FaGoogle className="text-sm" />
                </a>
              </div>
              <p className="text-gray-400 my-3">Usa tu cuenta institucional para acceder</p>
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 w-64 p-2 flex items-center mb-3 rounded-[var(--radius)]">
                  <FaRegEnvelope className="text-gray-400 m-2" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    className="bg-gray-100 outline-none text-sm flex-1"
                  />
                </div>
                <div className="bg-gray-100 w-64 p-2 flex items-center mb-3 rounded-[var(--radius)]">
                  <MdLockOutline className="text-gray-400 m-2" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    className="bg-gray-100 outline-none text-sm flex-1"
                  />
                </div>
                <div className="flex justify-between w-64 mb-5 text-gray-500">
                  <label className="flex items-center text-xs">
                    <input type="checkbox" name="remember" className="mr-1" /> Recordar
                  </label>
                  <a href="#" className="text-xs">¿Olvidaste tu contraseña?</a>
                </div>

                {/* ✅ Usa clase personalizada */}
                <a href="#" className="btn-signin">
                  Iniciar sesión
                </a>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="w-2/5 text-white rounded-tr-2xl py-36 px-12" style={{ backgroundColor: "var(--color-naranja)" }}>
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-fondo)" }}>
              ¡Bienvenido a la Gaceta "J-UP"!
            </h2>
            <div className="border-2 w-10 border-white inline-block mb-2"></div>
            <div className="mb-10 text-justify">
              Recuerda que para iniciar sesión debes usar tu cuenta institucional. Si aún no estás registrado pero quieres ser colaborador, comunícate con
              <span className="font-bold text-white"> gaceta@upqroo.edu.mx </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
