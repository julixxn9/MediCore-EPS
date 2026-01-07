// src/components/ModUsuario.tsx
import { useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import Campo from "./Campo";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Rol, type FormData } from "../types";
import Select from "./Select";
import { useAuth } from "../context/authContext";

function getUserFromStorage() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

interface Props {
  onClose: () => void;
}

export default function ModUsuario({ onClose }: Props) {
  const [mensaje, setMensaje] = useState<string | null>(null);
  const { setLogged, setLoading } = useAuth();
  const navegarA = useNavigate();
  const modalRef = useRef<HTMLDivElement | null>(null);

  const stored = getUserFromStorage();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      nombre: stored?.nombre ?? "",
      apellido: stored?.apellido ?? "",
      telefono: stored?.telefono ? String(stored.telefono) : "",
      cedula: stored?.cedula ? String(stored.cedula) : "",
      claveActual: "",
      claveNueva: "",
      foto: stored?.foto ?? "",
      rol: (stored?.rol as Rol) ?? Rol.Paciente,
    },
  });

  const isPatient = useMemo(
    () => (stored?.rol as Rol) === Rol.Paciente,
    [stored]
  );

  // 🔥 Cierra al hacer clic afuera
  function handleClickOutside(e: MouseEvent) {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch(
        import.meta.env.VITE_BACKEND + `EPS/pacientes/${data.cedula}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) throw new Error(await res.text());

      await res.json();
      setLogged(false);
      setLoading(true);
      navegarA("/auth/login");
      alert("Usuario actualizado correctamente");
      setMensaje("Cambios guardados con éxito");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar usuario");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"></div>

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-[#111526] w-[90%] max-w-2xl p-6 rounded-2xl border border-gray-700 shadow-xl animate-slideUp z-50"
      >
        <h1 className="text-xl font-semibold text-white mb-4 text-center">
          Modificar Usuario
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Campo
            titulo="Nombre"
            tipo="text"
            placeholder="Nombre"
            regis={register("nombre")}
            errors={errors}
            nombre="nombre"
          />

          <Campo
            titulo="Apellido"
            tipo="text"
            placeholder="Apellido"
            regis={register("apellido")}
            errors={errors}
            nombre="apellido"
          />

          <Campo
            titulo="Teléfono"
            tipo="number"
            placeholder="Teléfono"
            regis={register("telefono")}
            errors={errors}
            nombre="telefono"
          />

          <Campo
            titulo="Cédula"
            tipo="number"
            placeholder="Cédula"
            regis={register("cedula")}
            errors={errors}
            nombre="cedula"
          />

          <Campo
            titulo="Clave Actual"
            tipo="password"
            placeholder="Clave Actual"
            regis={register("claveActual")}
            errors={errors}
            nombre="claveActual"
          />

          <Campo
            titulo="Clave Nueva"
            tipo="password"
            placeholder="Clave Nueva"
            regis={register("claveNueva")}
            errors={errors}
            nombre="claveNueva"
          />

          <Select
            titulo="Rol"
            regis={register("rol")}
            errors={errors}
            nombre="rol"
            setValue={setValue}
            opciones={Object.values(Rol)}
            disabled={isPatient}
            estilosAdicionales="md:col-span-2"
          />


          <div className="flex gap-3 justify-end mt-4 md:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700/50 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md text-white font-semibold shadow-md transition"
            >
              Guardar
            </button>
          </div>
        </form>

        {mensaje && (
          <p className="mt-4 text-sm text-green-400 text-center">{mensaje}</p>
        )}
      </div>

      {/* Animaciones */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0 }
            to { opacity: 1 }
          }
          .animate-fadeIn {
            animation: fadeIn .3s ease-out;
          }

          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slideUp {
            animation: slideUp .3s ease-out;
          }
        `}
      </style>
    </div>
  );
}
