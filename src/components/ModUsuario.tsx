import { useUser } from "../context/UserContext";
import { useForm } from "react-hook-form";
import Campo from "./Campo";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface FormData {
  nombre: string;
  apellido: string;
  telefono: string;
  cedula: string;
  claveActual: string;
  claveNueva: string;
  foto?: string;
}

function ModUsuario() {
  const { user, updateUser } = useUser();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      alert("Debes iniciar sesión para modificar tus datos");
      navigate("/auth/login");
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      nombre: user?.nombre || "",
      apellido: user?.apellido || "",
      telefono: user?.telefono || "",
      cedula: user?.cedula || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!user || !user.cedula) {
      alert("No hay usuario logueado o falta cédula");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/EPS/pacientes/${data.cedula}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      updateUser(data);
      alert("Usuario actualizado correctamente ✅");
      setMensaje("Cambios guardados con éxito");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar usuario");
    }
  };

  return (
    <div>
      <h1>Modificar Usuario</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Campo titulo="Nombre" tipo="text" placeholder="Nombre" regis={register("nombre")} errors={errors} nombre="nombre" />
        <Campo titulo="Apellido" tipo="text" placeholder="Apellido" regis={register("apellido")} errors={errors} nombre="apellido" />
        <Campo titulo="Teléfono" tipo="number" placeholder="Teléfono" regis={register("telefono")} errors={errors} nombre="telefono" />
        <Campo titulo="Cédula" tipo="number" placeholder="Cédula" regis={register("cedula")} errors={errors} nombre="cedula" />
        <Campo titulo="Clave Actual" tipo="password" placeholder="Clave Actual" regis={register("claveActual")} errors={errors} nombre="claveActual" />
        <Campo titulo="Clave Nueva" tipo="password" placeholder="Clave Nueva" regis={register("claveNueva")} errors={errors} nombre="claveNueva" />
        <button type="submit">Guardar Cambios</button>
      </form>

      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
    </div>
  );
}

export default ModUsuario;
