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
import { useEffect } from "react";
import { useUser } from "./context/UserContext";

function App() {

    const [permitido, setPermitido] = useState<boolean>(false);
    const { setUser } = useUser();
    const [verificado, setVerificado] = useState<boolean>(true);

    useEffect(() => {
      const verficarPermitido = async () => {
        try {
           const request = await fetch("http://localhost:3000/auth/login", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           credentials: 'include', // importante
         });

         if (request.ok) {
           const response = await request.json();
           console.log('Usuario ya autenticado:', response);
           setPermitido(true);
           setUser(response.info);
         }
       } catch (error) {
         console.error("Error al verificar permiso:", error);
       } finally {
          setVerificado(false);
       }
     };

     verficarPermitido();
   }, [setUser]);

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
              <Route path="*" element={<> {
              verificado ? ( <p>
                Cargando...
              </p>) : (
                <NoUser />
              )
              }</>} />
                        )
          }
            <Route path="*" element={ <> {
              verificado ? ( <p>
                Cargando...
              </p>) : (
                permitido == false?
                <Navigate to="/auth/login" replace /> :
                <NoUser />
              )
              }</>} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
