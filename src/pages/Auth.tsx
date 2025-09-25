import { Outlet, useLocation, useNavigate } from "react-router-dom";

function Auth() {
  const location = useLocation(); // Obtener la ubicación actual
  const navigate = useNavigate(); // Hook para navegar programáticamente

  const isLogin = location.pathname.includes("login"); // Verificar si la ruta actual es /login

  return (
    <div className="relative flex w-[900px] h-[550px] bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Panel izquierdo */}
      <div className="flex flex-col justify-center items-center w-1/2 p-8 bg-gradient-to-br from-indigo-800 via-purple-800 to-indigo-900 text-white">
        {isLogin ? ( // decimos que si estamos en login muestre el panel de registro y viceversa
          <>
            <h2 className="text-3xl font-bold mb-4">¿Nuevo aquí?</h2>
            <p className="mb-6 text-center">
              Regístrate y comienza a explorar todas las funciones de TrendSell.
            </p>
            <button
              onClick={() => navigate("/auth/register")} // Navegar a /register al hacer clic
              className="px-6 py-2 rounded-lg bg-white text-indigo-900 font-semibold hover:bg-gray-200 transition"
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
              onClick={() => navigate("/auth/login")} // Navegar a /login al hacer clic
              className="px-6 py-2 rounded-lg bg-white text-indigo-900 font-semibold hover:bg-gray-200 transition"
            >
              Iniciar sesión
            </button>
          </>
        )}
      </div>

      {/* Panel derecho con transición */}
      <div
        className={`absolute right-0 top-0 w-1/2 h-full flex items-center justify-center bg-gray-900 transition-all duration-700 ease-in-out 
          ${isLogin ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
          // aqui isLogin es true, entonces aplica las clases de translate-x-0 y opacity-100, si no aplica las clases -translate-x-full y opacity-0
      >
        {isLogin && <Outlet />} {/* Renderizar el componente hijo (Login o Register) */}
      </div>

      <div
        className={`absolute right-0 top-0 w-1/2 h-full flex items-center justify-center bg-gray-900 transition-all duration-700 ease-in-out 
          ${!isLogin ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
          // aqui !isLogin es false cuando isLogin es true, entonces aplica las clases de translate-x-full y opacity-0, si no aplica las clases translate-x-0 y opacity-100
      >
        {!isLogin && <Outlet />}
      </div>
    </div>
  );
}

export default Auth;
