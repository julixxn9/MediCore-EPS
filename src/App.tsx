import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Auth from "./pages/Auth";
import Welcome from './pages/Welcome';
import { useState } from "react";
import Home from "./pages/Home";
import NoUser from "./components/NoUser";

function App() {

  // un estado el cual no me permita ingresar que vengan despues de logarme o registrarme (Home por ejemplo)
  const [permitido, setPermitido] = useState<boolean>(false);

  // setPermitido(true); // simular que ya se logueo o registro

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-black">
      <BrowserRouter>
        <Routes>
          {/* Ruta de bienvenida */}
          <Route path="/" index element={<Welcome />} />
          {/* Rutas de autenticación */}
          <Route path="/auth" element={<Auth />}>
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<Login puedoEntrar={setPermitido} />} />
            <Route path="register" element={<Register />} />
          </Route>
          {/* Ruta protegida de Home y mas */}
          {
            permitido ? (
              <Route path="/home" element={<Home />} />
            ) : (
              <Route path="/home" element={<NoUser />} />
            )
          }
          <Route path="*" element={ <div className="text-white text-2xl"> Página no encontrada. <a href="/" className="underline">Ir a inicio</a> </div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
