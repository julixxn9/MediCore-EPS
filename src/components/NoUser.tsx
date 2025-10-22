import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldAlert, Stethoscope } from "lucide-react";

const NoUser = () => {
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white px-4 text-center">
      {/* SVG decorativo de fondo */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#312e81" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="400" cy="300" r="300" fill="url(#grad)" />
          <path
            d="M100 500 C200 350 600 350 700 500"
            stroke="#6366f1"
            strokeWidth="1"
            fill="none"
            opacity="0.2"
          />
        </svg>
      </div>

      {/* Icono animado */}
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="mb-6"
      >
        <ShieldAlert size={70} className="text-purple-500 drop-shadow-lg" />
      </motion.div>

      {/* Texto principal */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl md:text-5xl font-bold mb-4"
      >
        Acceso restringido
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-gray-300 max-w-md text-lg"
      >
        Parece que intentas acceder sin una cuenta activa.  
        Inicia sesión o crea una cuenta para continuar explorando MediCore.
      </motion.p>

      {/* Botones */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex gap-4 mt-8 flex-wrap justify-center"
      >
        <Link
          to="/auth/login"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-2xl font-semibold transition-transform hover:scale-105"
        >
          Iniciar sesión
        </Link>
        <Link
          to="/auth/register"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-semibold transition-transform hover:scale-105"
        >
          Crear cuenta
        </Link>
      </motion.div>

      {/* Ícono decorativo flotante */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-10 opacity-40"
      >
        <Stethoscope size={40} className="text-indigo-400" />
      </motion.div>
    </div>
  );
};

export default NoUser;
