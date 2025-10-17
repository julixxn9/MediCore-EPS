import { useState } from "react";
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
          {/* Contenido del modal */}
          <motion.div
            className="bg-white rounded-lg shadow-lg w-[400px] p-6 flex flex-col items-center relative"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl font-bold mb-4">Subir Foto de Perfil</h2>

            {/* Vista previa */}
            <img
              src={preview}
              alt="preview"
              className="w-24 h-24 rounded-full object-cover border mb-4"
            />

            {/* Input de URL */}
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

            {/* Input de archivo */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="mb-4"
            />

            {/* Botones */}
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

export default PhotoPerfil;
