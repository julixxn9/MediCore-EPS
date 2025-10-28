// la foto sera personalizada luego de registrarse y despues loguearse y no sera obligatorio ya que si no agrega foto habra una por defecto en esta vista que se mostrara la foto de perfil en el caso de que el usuario quiera cambiarla toccara que agregar una url o subir una imagen desde el dispositivo, una vez suceda eso se mostrara la foto de perfil personalizada y se agregara visualmente y temporalmente en el frontend hasta que se guarde en la base de datos (o sea le de al boton guardar) y se actualice el estado del usuario en el backend teniendo en cuenta que se puede agregar una imagen como url o subirla desde el dispositivo o sea que toca convertirla la imagen a base64 para guardarla en la base de datos y no como archivo

/*import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import extractUriImage from "extract-uri-image"; // asegúrate de instalarlo
const defaultAvatar = "/assets/avatar.png";

interface PhotoPerfilProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (image: string) => void;
}

function PhotoPerfil({ isOpen, onClose, onSave }: PhotoPerfilProps) {
  const [preview, setPreview] = useState<string>(defaultAvatar); // el useState<string>(defaultAvatar): inicializa con avatar por defecto
  const [tempImage, setTempImage] = useState<string | null>(null); // el useState<string | null>(null) quiere decir que puede ser string o null la imagen temporal
//   la imagen temporal es para guardar la imagen que el usuario selecciona antes de guardarla definitivamente (preview es para mostrarla)
  const [urlInput, setUrlInput] = useState("");

  // Manejar carga desde archivo
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64 = await extractUriImage.blob(file);
      setPreview(base64);
      setTempImage(base64);
    }
  };

  // Manejar carga desde URL
  const handleUrlUpload = () => {
    try {
      new URL(urlInput); // validar si es URL válida
      setPreview(urlInput);
      setTempImage(urlInput);
    } catch {
      alert("URL no válida");
    }
  };

  const handleSave = () => {
    onSave(tempImage || defaultAvatar);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Contenido del modal }
          <motion.div
            className="bg-white rounded-lg shadow-lg w-[400px] p-6 flex flex-col items-center relative"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl font-bold mb-4">Subir Foto de Perfil</h2>

            {/* Vista previa }
            <img
              src={preview}
              alt="preview"
              className="w-24 h-24 rounded-full object-cover border mb-4"
            />

            {/* Input de URL }
            <div className="flex w-full gap-2 mb-3">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Pega una URL de imagen"
                className="flex-1 border px-2 py-1 rounded"
              />
              <button
                onClick={handleUrlUpload}
                className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Usar
              </button>
            </div>

            {/* Input de archivo }
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="mb-4"
            />

            {/* Botones }
            <div className="flex gap-3 mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Guardar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PhotoPerfil;*/

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../context/UserContext";

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

function FotoPerfil() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const [preview, setPreview] = useState(
    user?.foto || "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
  );
  const [urlFoto, setUrlFoto] = useState("");
  const [base64, setBase64] = useState("");

  const handleArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await toBase64(file);
    setBase64(result);
    setPreview(result);
  };

  const handleGuardar = async () => {
    try {
      const fotoFinal = base64 || urlFoto || preview;
      if (!user?.cedula) {
        alert("No se encontró el usuario logueado");
        return;
      }

      const res = await fetch(`http://localhost:3000/api/pacientes/foto/${user.cedula}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foto: fotoFinal }),
      });

      if (!res.ok) throw new Error("Error al actualizar la foto");

      setUser({ ...user, foto: fotoFinal });
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
