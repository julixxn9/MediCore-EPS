import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/authContext";

// Componentes públicos
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Login from "./components/Login";
import Register from "./components/Register";
import NoUser from "./components/NoUser";

// Componentes protegidos
import FotoPerfil from "./pages/FotoPerfil";
import Home from "./pages/Home";
import ModUsuario from "./components/ModUsuario";

// 🟣 Componente para proteger rutas
function ProtectedRoutes() {
  const { logged } = useAuth();
  return logged ? <Outlet /> : <Navigate to="/" replace />;
}

function App() {
  const { logged } = useAuth();

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-black">
      <BrowserRouter>

        <Routes>

          {/* 🟡 Rutas cuando NO está logueado */}
          {!logged && (
            <>
              <Route path="/" element={<Welcome />} />

              {/* Layout de autenticación */}
              <Route path="/auth" element={<Auth />}>
                <Route index element={<Navigate to="login" replace />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>

              {/* Cualquier URL inválida muestra NoUser */}
              <Route path="*" element={<NoUser />} />
            </>
          )}

          {/* 🟢 Rutas cuando SÍ está logueado */}
          {logged && (
            <>
              {/* Todas las rutas protegidas pasan por ProtectedRoutes */}
              <Route element={<ProtectedRoutes />}>
                
                {/* Dashboard principal */}
                <Route path="/" element={<ModUsuario />} />

                {/* Home */}
                <Route path="/home" element={<Home />} />
                
                {/* Editar Foto de perfil */}
                <Route path="/perfil-setup" element={<FotoPerfil />} />

                {/* Evitar acceso a /auth si ya está logueado */}
                <Route path="/auth/*" element={<Navigate to="/" replace />} />
              </Route>

              {/* 404 también dentro del modo logueado */}
              <Route path="*" element={<NoUser />} />
            </>
          )}
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
