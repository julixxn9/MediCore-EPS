import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// deje de usar useEffect y useRef porque causaban parpadeos en la animación al navegar rápido

function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname.includes("login"); // true si estamos en /auth/login
  const [ locatedPath, setLocatedPath ] = useState(location.pathname); // estado para guardar la ruta actual para animar
  const [isAnimating, setIsAnimating] = useState(false);

  // variantes de animación del panel morado
  const panelVariants = {
    login: { x: "0%" }, // panel en el lado izquierdo
    register: { x: "100%" }, // panel en el lado derecho
  };

  // variantes de animación del formulario
  const formVariants = {
    initial: { opacity: 0,},
    animate: { opacity: 1, transition: { duration: .7,  delay: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.4 } },
  };

  const handleNavigate = (path: string) => {
    if (isAnimating) return; // bloqueo mientras anima
    setIsAnimating(true);
    setLocatedPath(path)
    // esperamos a que acabe la animación del panel antes de navegar
    setTimeout(() => {
      navigate(path);
      setIsAnimating(false);
    }, 700); // debe coincidir con la duración del motion.div
  };

  return (
    <div className="relative flex w-[900px] h-[550px] bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Panel morado animado */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center items-center p-8 
                   bg-gradient-to-br from-indigo-800 via-purple-800 to-indigo-900 text-white z-10"
        variants={panelVariants}
        // uso de variables para animar a la izquierda o derecha según ruta
        animate={isLogin ? "login" : "register"} // animar según si estamos en login o register
        transition={{ duration: 0.7, ease: "easeInOut"}}
      >
        {isLogin ? (
          <>
            <h2 className="text-3xl font-bold mb-4">¿Nuevo aquí?</h2>
            <p className="mb-6 text-center">
              Regístrate y comienza a explorar todas las funciones de MediCore EPS.
            </p>
            <button
              onClick={() => handleNavigate("/auth/register")
              }

              disabled={isAnimating} // deshabilitar botón mientras anima
              className={`px-6 py-2 rounded-lg bg-white text-indigo-900 font-semibold transition ${
                isAnimating ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
              }`}
            >
              Registrarse
            </button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-4">¿Ya tienes cuenta?</h2>
            <p className="mb-6 text-center">
              Inicia sesión para acceder a tu cuenta y continuar comprando.
            </p>
            <button
              onClick={() => handleNavigate("/auth/login")}
              disabled={isAnimating} // deshabilitar botón mientras anima
              className={`px-6 py-2 rounded-lg bg-white text-indigo-900 font-semibold transition ${
                isAnimating ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
              }`}
            >
              Iniciar sesión
            </button>
          </>
        )}
      </motion.div>

      {/* Formulario dinámico (izquierda o derecha según ruta) */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={locatedPath} // clave para que AnimatePresence detecte el cambio de ruta
          className={`absolute top-0 w-1/2 h-full flex items-center justify-center bg-gray-900 z-10 ${
            isLogin ? "right-0" : "left-0" // formulario a la derecha si es login, izquierda si es register
          }`}
          variants={formVariants}
          initial="initial" // estado inicial de opacidad 0
          animate="animate" // estado animado con opacidad 1
          exit="exit" // estado de salida con opacidad 0
        >
          <Outlet />
        </motion.div> {/* Outlet para renderizar Login o Register y el motion.div para animar */}
      </AnimatePresence>
    </div>
  );
}

export default Auth;