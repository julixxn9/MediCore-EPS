import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Auth from "./pages/Auth";

function App() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-black">
      <BrowserRouter>
        <Routes>
          {/* Rutas de autenticación */}
          <Route path="/auth" element={<Auth />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="*" element={<div className="text-white">404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
