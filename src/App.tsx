import { useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Auth from "./pages/Auth";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import FotoPerfil from "./pages/FotoPerfil";
import { UserProvider } from "./context/UserContext";
import NoUser from "./components/NoUser";

function App() {

    const [permitido, setPermitido] = useState<boolean>(false);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-black">
      <UserProvider>
        <BrowserRouter>
          <Routes>
            {/* Página de bienvenida */}
          <Route path="/" index element={<Welcome />} />
          {/* Rutas de autenticación */}
          <Route path="/auth" element={<Auth />}>
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<Login puedoEntrar={setPermitido} />} />
            <Route path="register" element={<Register />} />
          </Route>
          {/* Rutas protegidas */}
            {
            permitido ? (
              <><Route path="/perfil-setup" element={<FotoPerfil />} />
              <Route path="/home" element={<Home />} /></>
            ) : (
              <Route path="/home" element={<NoUser />} />
            )
          }
            <Route path="*" element={<div className="text-white">404 Not Found</div>} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
