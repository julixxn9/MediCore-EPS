// import { useState } from "react";
import { useForm } from "react-hook-form";
import { type RegisterFormInputs } from "../types";
import Campo from "./Campo";
// import PhotoPerfil from "./PhotoPerfil";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  // const [photo, setPhoto] = useState("/assets/avatar.png");
  // const [showModal, setShowModal] = useState(false);

  const handlerSubmit = handleSubmit(async (data) => {
    try {
      const cuerpo = {
        cedula: data.cedula,
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono,
        clave: data.clave,
        confirmarPassword: data.confirmarPassword,
        foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcg3ZFcL6sAObKAc8xIpvKpk5T-pYqpIbb7w&s',
      };

      const response = await fetch(
        `http://localhost:3000/EPS/pacientes/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cuerpo),
        }
      );

      const result = await response.json();
      console.log(result);
        navigate("/auth/login");
    } catch (error) {
      console.error(error);
      alert("ha ocurrido un error al registrar el usuario");
    }
  });

  // función que podría abrir el modal de la foto de perfil
  // function setShowModalPerfil(show: boolean) {
  //   setShowModal(show);
  // }

  return (
    <>
      <form
        onSubmit={handlerSubmit}
        className="w-3/4 max-w-sm space-y-3"
      >
        <h2 className="text-2xl font-bold text-white text-center">
          Crear Cuenta
        </h2>

        {/* campos principales */}
        <Campo
          titulo="Nombre"
          tipo="text"
          placeholder="Nombre"
          regis={register("nombre", { required: "El nombre es obligatorio" })}
          errors={errors}
          nombre="nombre"
        />

        <Campo
          titulo="Apellido"
          tipo="text"
          placeholder="Apellido"
          regis={register("apellido", { required: "El apellido es obligatorio" })}
          errors={errors}
          nombre="apellido"
        />

        <Campo
          titulo="Teléfono"
          tipo="number"
          placeholder="Teléfono"
          regis={register("telefono", { required: "El teléfono es obligatorio" })}
          errors={errors}
          nombre="telefono"
        />

        {/* foto de perfil */}
        {/* <div className="flex flex-col items-center mb-4">
          {/* <img
            src={photo}
            alt="foto de perfil"
            className="w-20 h-20 rounded-full border mb-2"
          />
          <button
            type="button"
            // onClick={() => setShowModalPerfil(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Cambiar Foto
          </button>
        </div> */}

        <Campo
          titulo="Cédula"
          tipo="number"
          placeholder="Número de cédula"
          regis={register("cedula", { required: "La cédula es obligatoria" })}
          errors={errors}
          nombre="cedula"
        />

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

        <Campo
          titulo="Confirmar contraseña"
          tipo="password"
          placeholder="Confirmar contraseña"
          regis={register("confirmarPassword", {
            required: "Este campo es obligatorio",
            validate: (clave: string) => {
              if (typeof clave !== "string") {
                return "La clave debe ser una cadena de texto";
              }
              if (clave.length < 6 || clave.length > 20) {
                return "La clave debe tener entre 6 y 20 caracteres";
              }
              const regex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
              if (!regex.test(clave)) {
                return "La clave debe contener al menos una letra y un número";
              }
            },
          })}
          errors={errors}
          nombre="confirmarPassword"
        />

        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-500 transition"
        >
          Registrarse
        </button>
      </form>

      {/* modal de foto de perfil (comentado por ahora, pero listo para usar) */}
      {/*
      <PhotoPerfil
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={setPhoto}
      />;
      */}
    </>
  );
}

export default Register;
