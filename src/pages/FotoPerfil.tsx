import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/authContext";


const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
  
  function FotoPerfil() {
  useAuth()
  const navigate = useNavigate();
  // const { user, setUser } = useUser();

  const [preview, setPreview] = useState("https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
  );
  const [urlFoto, setUrlFoto] = useState("");
  // const [base64, setBase64] = useState("");

  const handleArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await toBase64(file);
    // setBase64(result);
    setPreview(result);
  };

  const handleGuardar = async () => {
    try {
      // const fotoFinal = base64 || urlFoto || preview;
      // if (!user?.cedula) {
      //   alert("No se encontró el usuario logueado");
      //   return;
      // }

      // const res = await fetch(`http://localhost:3000/api/pacientes/foto/${user.cedula}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ foto: fotoFinal }),
      // });

      // if (!res.ok) throw new Error("Error al actualizar la foto");

      // setUser({ ...user, foto: fotoFinal });
      navigate("/home");
    } catch (error) {
      console.error(error);
      alert("Error al guardar la foto de perfil");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800 bg-opacity-50 p-10 rounded-2xl shadow-xl flex flex-col items-center gap-6"
      >
        <h1 className="text-3xl font-semibold text-purple-400 mb-2">Configura tu foto de perfil</h1>
        <p className="text-gray-300 text-center max-w-sm">
          Puedes subir una imagen desde tu dispositivo o pegar una URL. Esta será tu foto de usuario dentro de MediCore.
        </p>

        <img
          src={preview}
          alt="Previsualización"
          className="w-40 h-40 rounded-full object-cover border-4 border-purple-500 shadow-md"
        />

        <div className="flex flex-col gap-3 mt-4 w-full">
          <input
            type="file"
            accept="image/*"
            onChange={handleArchivo}
            className="bg-gray-700 text-sm p-2 rounded-lg cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
          />
          <input
            type="text"
            placeholder="Pega una URL de imagen..."
            value={urlFoto}
            onChange={(e) => setUrlFoto(e.target.value)}
            className="bg-gray-700 p-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate("/home")}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
          >
            Omitir
          </button>
          <button
            onClick={handleGuardar}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
          >
            Guardar foto
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default FotoPerfil;
