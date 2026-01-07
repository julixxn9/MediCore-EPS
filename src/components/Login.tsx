import { useForm } from "react-hook-form";
import { type LoginFormInputs } from "../types";
import Campo from "./Campo";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

function Login() {
  const navigate = useNavigate();
  const { setLoading, setLogged } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

  const handlerSubmit = handleSubmit(async (data) => {
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND+'/auth/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: 'include', // importante
      });

      const result = await response.json();

      if (!response.ok) {
        console.log(result)
        alert(result?.message || "Credenciales incorrectas");
        return;
      }

      // Guarda usuario en contexto + localStorage
      localStorage.setItem("user", JSON.stringify(result));
      console.log("Login exitoso:", result);
      setLoading(true)
      setLogged(true)
      navigate("/perfil-setup");
    } catch (error) {
      console.error(error);
      alert("Error al iniciar sesión");
    }
  });

  return (
    <form onSubmit={handlerSubmit} className="w-3/4 max-w-sm space-y-5">
      <h2 className="text-2xl font-bold text-white text-center">Iniciar Sesión</h2>

      <Campo titulo="Cédula" tipo="number" placeholder="Número de cédula"
        regis={register("cedula", { required: "La cédula es obligatoria" })} errors={errors} nombre="cedula" />

      <Campo titulo="Contraseña" tipo="password" placeholder="Contraseña"
        regis={register("clave", { required: "La contraseña es obligatoria" })} errors={errors} nombre="clave" />

      <button type="submit" className="w-full py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-500 transition">
        Entrar
      </button>
    </form>
  );
}

export default Login;
