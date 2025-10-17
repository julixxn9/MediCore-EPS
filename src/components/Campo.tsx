import { useState } from "react";
import show from "/icon/eye.svg";
import hide from "/icon/eye-slash-fill.svg";
import { type CampoProps } from "../types";
import { type FieldValues } from "react-hook-form";

// conjunto de campos de 'DatosForm', es decir, "nombre, apellido, cedula, clave, etc..."
function Campo<T extends FieldValues>({
  titulo,
  tipo,
  placeholder,
  regis,
  errors,
  nombre,
}: CampoProps<T>) {
  // useState de arriba para hacer el mostrar y ocultar contraseña
  const [showPass, setShowPass] = useState<boolean>(false);

  return (
    <label className="flex flex-col">
      {/* digo que el titulo del campo es igual al prop */}
      <span className="text-[0.9rem] text-white font-medium">{titulo}</span>

      <div className="relative flex items-center">
        {/* desafío de lógica:
            si el tipo es 'password' y showPass es verdadero, entonces el input es text
            sino, el input es del tipo original que mandaste */}
        <input
          type={tipo === "password" ? (showPass ? "text" : "password") : tipo}
          placeholder={placeholder}
          {...regis}
          className={`w-full px-3 py-1 rounded-lg bg-gray-800 text-white placeholder-gray-400 border 
          ${
            errors[nombre]
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-700 focus:ring-purple-500"
          } focus:outline-none focus:ring-2 transition`}
        />

        {/* si el tipo es password, quiero decir que quiero mostrar el ojito de mostrar/ocultar clave */}
        {tipo === "password" && (
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 cursor-pointer"
          >
            <img
              src={showPass ? hide : show}
              alt="Mostrar u ocultar contraseña"
              className="w-5 h-5"
            />
          </button>
        )}
      </div>

      {/* párrafo de error, como el objeto 'errors' guarda todos los campos, 
          le decimos que solo queremos el que le indicamos en el register */}
      {errors[nombre] && (
        <span className="text-red-400 text-sm mt-1">
          {String(errors[nombre]?.message)}
        </span>
      )}
    </label>
  );
}

export default Campo;
