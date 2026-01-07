// src/components/PanelUsuario.tsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useProfile } from "../context/PerfileContext"; // ajusta ruta si tu contexto está en otra ruta

export default function PanelUsuario() {
  const { profile } = useProfile();
  const [openMobile, setOpenMobile] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Datos seguros para mostrar
  const nombre = profile?.nombre ?? "Nombre";
  const apellido = profile?.apellido ?? "Apellido";
  const foto = profile?.foto ?? "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg";
  const cedula = profile?.cedula ?? "----";
  const telefono = profile?.telefono ?? "----";
  const rol = String(profile?.rol ?? "Paciente");

  return (
    <>
      {/* ---------- Desktop sidebar (visible desde md) ---------- */}
      <aside
        className="hidden md:flex md:flex-col md:fixed md:left-6 md:top-8 md:h-[calc(100vh-64px)] md:w-80 md:rounded-2xl md:shadow-2xl md:bg-[#0f1220] md:border md:border-gray-800 z-40"
        aria-label="Panel de usuario"
      >
        {/* vertical purple accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-l-2xl" />

        <div className="relative p-6 flex flex-col h-full gap-4">
          {/* Avatar */}
          <div className="relative self-start">
            <img
              src={foto}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover border-4 border-transparent transition-all duration-200 hover:border-purple-600"
            />
            {/* Edit icon (maquetado) */}
            <button
              type="button"
              aria-label="Editar foto"
              className="absolute -right-2 -bottom-1 bg-[#11121a] border border-gray-700 p-1 rounded-full hover:bg-purple-600 transition"
              title="Editar foto (maquetado)"
              onClick={() => {
                /* solo maquetado: aquí se podría abrir el componente editar foto */
              }}
            >
              {/* small pencil icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" d="M12 20h9" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
              </svg>
            </button>
          </div>

          {/* Nombre y rol */}
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => setShowDetails((s) => !s)}
              className="text-left"
            >
              <h2 className="text-2xl font-semibold text-white leading-tight hover:text-purple-300 transition">
                {nombre} {apellido}
              </h2>
              <p className="text-sm text-gray-400 mt-1">{rol}</p>
            </button>

            {/* details overlay (superpuesto, no cambia layout) */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute mt-[96px] left-6 w-[calc(320px-48px)] bg-[#0b0d14] border border-gray-700 rounded-lg p-4 shadow-xl z-50"
                >
                  <div className="flex flex-col gap-2">
                    <div className="text-xs text-gray-400">Cédula</div>
                    <div className="text-sm text-white font-medium">{cedula}</div>

                    <div className="text-xs text-gray-400 mt-2">Teléfono</div>
                    <div className="text-sm text-white font-medium">{telefono}</div>

                    <div className="text-xs text-gray-400 mt-2">Rol</div>
                    <div className="text-sm text-white font-medium">{rol}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-[#11121a] border border-gray-700 text-gray-200 hover:bg-[#151727] transition"
              onClick={() => {
                /* Maquetado: abrir ajustes */
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 01.67 18.89l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82L4.21 5.6A2 2 0 016.04 2.77l.06.06A1.65 1.65 0 008 .7 1.65 1.65 0 0010 0h4a1.65 1.65 0 001.82.33l.06-.06A2 2 0 0119.33 2.77l-.06.06a1.65 1.65 0 00-.33 1.82 1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
              Ajustes
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-[#11121a] border border-gray-700 text-gray-200 hover:bg-red-700 hover:text-white transition"
              onClick={() => {
                // Maquetado: manejar logout real
                // Aquí puedes llamar a tu contexto / logout
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" d="M17 16l4-4m0 0l-4-4m4 4H7" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" d="M7 8v8" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* ---------- Mobile: floating FAB (left) + sliding panel ---------- */}
      {/* FAB (visible < md) */}
      <div className="md:hidden">
        <button
          type="button"
          aria-label="Abrir panel usuario"
          onClick={() => setOpenMobile(true)}
          className="fixed left-4 bottom-6 z-50 bg-purple-600 hover:bg-purple-500 text-white w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:-translate-y-1"
        >
          {/* user icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 12a5 5 0 100-10 5 5 0 000 10z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M21 21a9 9 0 10-18 0" />
          </svg>
        </button>

        <AnimatePresence>
          {openMobile && (
            <>
              {/* overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.55 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 bg-black z-40"
                onClick={() => setOpenMobile(false)}
              />

              {/* sliding panel */}
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed left-0 top-0 z-50 h-full w-64 bg-[#0f1220] border-r border-gray-800 p-5"
                aria-label="Panel de usuario móvil"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3">
                    <img src={foto} alt="avatar" className="w-14 h-14 rounded-full object-cover border-4 border-purple-600" />
                    <div>
                      <h3 className="text-base font-semibold text-white">{nombre} {apellido}</h3>
                      <p className="text-xs text-gray-400">{rol}</p>
                    </div>
                    <div className="ml-auto">
                      <button onClick={() => setOpenMobile(false)} className="text-gray-300 hover:text-white">
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-[#11121a] border border-gray-700 text-gray-200 hover:bg-[#151727] transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 01.67 18.89l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82L4.21 5.6A2 2 0 016.04 2.77l.06.06A1.65 1.65 0 008 .7 1.65 1.65 0 0010 0h4a1.65 1.65 0 001.82.33l.06-.06A2 2 0 0119.33 2.77l-.06.06a1.65 1.65 0 00-.33 1.82 1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                      </svg>
                      Ajustes
                    </button>

                    <button
                      type="button"
                      className="w-full mt-3 flex items-center gap-3 px-3 py-2 rounded-md bg-[#11121a] border border-gray-700 text-gray-200 hover:bg-red-700 hover:text-white transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M17 16l4-4m0 0l-4-4m4 4H7" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M7 8v8" />
                      </svg>
                      Cerrar sesión
                    </button>
                  </div>

                  <div className="mt-auto text-xs text-gray-500">© {new Date().getFullYear()} MediCore</div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
