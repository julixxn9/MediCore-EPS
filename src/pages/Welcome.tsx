import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Welcome() {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white select-none">
      {/* fondo decorativo tipo red médica / conexiones */}
      <div className="absolute inset-0 overflow-hidden">
        {/* red de líneas y puntos animados */}
        <svg
          className="absolute w-full h-full opacity-15"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <radialGradient id="grad" cx="50%" cy="50%" r="75%">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#312e81" stopOpacity="0.05" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad)" />
          <g stroke="#a78bfa" strokeWidth="0.5" opacity="0.2">
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={(i + 1) * 120}
                y1="0"
                x2={(i + 1) * 40}
                y2="100%"
              />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={(i + 1) * 60}
                x2="100%"
                y2={(i + 1) * 100}
              />
            ))}
          </g>
        </svg>

        {/* resplandor animado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.4, scale: 1.05 }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
          className="absolute w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* contenido principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="z-10 text-center px-4"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent drop-shadow-lg">
          MediCore
        </h1>
        <p className="mt-3 text-lg md:text-xl text-gray-300 font-light">
          Tu salud digital, simple y segura.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/auth/login"
            className="w-40 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-purple-500/30"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/auth/register"
            className="w-40 px-6 py-3 border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-purple-500/30"
          >
            Crear cuenta
          </Link>
        </div>
      </motion.div>
      {/* pie de página */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.5, duration: 1.2 }}
        className="absolute bottom-5 text-xs md:text-sm text-gray-500"
      >
        © {new Date().getFullYear()} MediCore. Todos los derechos reservados.
      </motion.footer>
    </div>
  );
}

export default Welcome;
