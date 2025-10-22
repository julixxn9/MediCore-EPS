// import { useState } from "react";
import { useForm } from "react-hook-form";
import { type LoginFormInputs } from "../types";
import Campo from "./Campo";
import { useNavigate } from "react-router-dom";
// import ModalOlvideClave from "./ModalOlvideClave"; // ejemplo futuro, de momento comentado

function Login({puedoEntrar}: {puedoEntrar: (valor: boolean) => void}) {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  // si más adelante se agrega modal (por ejemplo, para recuperar contraseña)
  // const [showModal, setShowModal] = useState(false);

  // logica de envío de datos al backend
  const handlerSubmit = handleSubmit(async (data) => {
    try {
      const cuerpo = {
        cedula: data.cedula,
        clave: data.clave,
      };

      const response = await fetch("http://localhost:3000/EPS/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cuerpo),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result?.message || "Credenciales incorrectas"); // si el backend envía un mensaje de error, lo muestro, sino un mensaje por defecto
        // result?.message es para evitar error si result es undefined, ? es para acceder solo si existe
        return;
      }

      puedoEntrar(true);
      console.log("Login exitoso:", result);
      navigate('/home');
      // aquí podrías redirigir, guardar token, etc
    } catch (error) {
      console.error(error);
      alert("ha ocurrido un error al iniciar sesión");
    }
  });
  

  return (
    <>
      <form
        onSubmit={handlerSubmit}
        className="w-3/4 max-w-sm space-y-5"
      >
        <h2 className="text-2xl font-bold text-white text-center">
          Iniciar Sesión
        </h2>

        {/* campo cédula */}
        <Campo
          titulo="Cédula"
          tipo="number"
          placeholder="Número de cédula"
          regis={register("cedula", { required: "La cédula es obligatoria" })}
          errors={errors}
          nombre="cedula"
        />

        {/* campo clave */}
        <Campo
          titulo="Contraseña"
          tipo="password"
          placeholder="Contraseña"
          regis={register("clave", {
            required: "La contraseña es obligatoria",
            minLength: {
              value: 6,
              message: "Debe tener al menos 6 caracteres",
            },
          })}
          errors={errors}
          nombre="clave"
        />

        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-500 transition"
        >
          Entrar
        </button>

        {/* ejemplo de boton para abrir modal (futuro) */}
        <button
          type="button"
          // onClick={() => setShowModal(true)}
          className="block w-full text-sm text-purple-300 hover:text-purple-200 mt-2"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </form>

      {/* modal futuro (comentado por ahora) */}
      {/*
      <ModalOlvideClave
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
      */}
    </>
  );
}

export default Login;
