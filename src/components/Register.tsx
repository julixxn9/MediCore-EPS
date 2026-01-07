import { useForm } from "react-hook-form";
import { Rol, type RegisterFormInputs } from "../types";
import Campo from "./Campo";
import { useNavigate } from "react-router-dom";
// import { useUser } from "../context/authContext";

function Register() {
  const navigate = useNavigate();
  // const { setUser } = useUser();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const handlerSubmit = handleSubmit(async (data) => {
    try {
      const cuerpo = {
        cedula: data.cedula,
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono,
        clave: data.clave,
        confirmarPassword: data.confirmarPassword,
        foto: "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
        rol: Rol
      };

      const response = await fetch(import.meta.env.VITE_BACKEND+'/EPS/pacientes/', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpo),
      });

      const result = await response.json();
      console.log(result);
      if (!response.ok) {
        alert(result?.message || "Error al registrar el usuario");
        return;
      }

      // Guarda el usuario completo en contexto y localStorage
      // setUser(result);
      localStorage.setItem("user", JSON.stringify(result));

      console.log("Registro exitoso:", result);
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Ha ocurrido un error al registrar el usuario");
    }
  });

  return (
    <form onSubmit={handlerSubmit} className="w-3/4 max-w-sm space-y-3">
      <h2 className="text-2xl font-bold text-white text-center">
        Crear Cuenta
      </h2>

      <Campo titulo="Nombre" tipo="text" placeholder="Nombre"
        regis={register("nombre", { required: "El nombre es obligatorio" })} errors={errors} nombre="nombre" />

      <Campo titulo="Apellido" tipo="text" placeholder="Apellido"
        regis={register("apellido", { required: "El apellido es obligatorio" })} errors={errors} nombre="apellido" />

      <Campo titulo="Teléfono" tipo="number" placeholder="Teléfono"
        regis={register("telefono", { required: "El teléfono es obligatorio" })} errors={errors} nombre="telefono" />

      <Campo titulo="Cédula" tipo="number" placeholder="Número de cédula"
        regis={register("cedula", { required: "La cédula es obligatoria" })} errors={errors} nombre="cedula" />

      <Campo titulo="Contraseña" tipo="password" placeholder="Contraseña"
        regis={register("clave", {
          required: "La contraseña es obligatoria",
          minLength: { value: 6, message: "Debe tener al menos 6 caracteres" },
        })} errors={errors} nombre="clave" />

      <Campo titulo="Confirmar contraseña" tipo="password" placeholder="Confirmar contraseña"
        regis={register("confirmarPassword", {
          required: "Este campo es obligatorio",
          validate: (clave) =>
            clave == getValues("clave") || "Las contraseñas no coinciden",
        })} errors={errors} nombre="confirmarPassword" />
      <button type="submit" className="w-full py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-500 transition">
        Registrarse
      </button>
    </form>
  );
}

export default Register;
