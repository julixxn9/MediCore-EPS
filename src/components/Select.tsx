// src/components/Select.tsx
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type {
  FieldValues,
  UseFormRegisterReturn,
  UseFormSetValue,
  Path,
  PathValue,
} from "react-hook-form";
import type { selectProps } from "../types";
import { RoleOption } from "./Roles";

type LocalSelectProps<T extends FieldValues> = selectProps<T> & {
  regis: UseFormRegisterReturn;
  setValue: UseFormSetValue<T>;
  opciones: PathValue<T, Path<T>>[];
  nombre: Path<T>;
  estilosAdicionales?: string;
  disabled?: boolean;
};

function Select<T extends FieldValues>(props: LocalSelectProps<T>) {
  const { titulo, regis, errors, nombre, setValue, opciones, estilosAdicionales = "", disabled = false } = props;

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>("");
  const rootRef = useRef<HTMLLabelElement | null>(null);

  // Cerrar al hacer click afuera
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Función que actualiza react-hook-form usando setValue con tipos correctos
  const applyValue = (op: PathValue<T, Path<T>>) => {
    // tipado: convertir op al PathValue esperado
    const value = op as unknown as PathValue<T, Path<T>>;
    setValue(nombre, value, { shouldDirty: true, shouldTouch: true });
    // actualizar vista (siempre como string)
    setSelected(String(op ?? ""));
    setOpen(false);
  };

  // Si el campo ya fue registrado y tiene value, inicializar label visual:
  useEffect(() => {
    try {
      // regis no tiene método para leer valor por sí mismo; asumimos que setValue o defaultValues gestionan
      // Si ya hay un value "seleccionado" en el DOM (por ejemplo defaultValue), lo leemos:
      // (Este bloque es defensivo; no rompe si no existe)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const maybeVal = (regis as any).value;
      if (maybeVal !== undefined && maybeVal !== null && String(maybeVal) !== "") {
        setSelected(String(maybeVal));
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <label className={`flex flex-col relative w-full ${estilosAdicionales}`} ref={rootRef}>
      <span className="text-sm text-gray-200 font-medium mb-1">{titulo}</span>

      {/* trigger */}
      <button
        type="button"
        onClick={() => !disabled && setOpen((s) => !s)}
        disabled={disabled}
        className={`w-full text-left px-3 py-2 bg-[#11121a] border ${disabled ? "border-gray-800/60" : "border-purple-600"} rounded-md text-white flex items-center justify-between focus:ring-2 focus:ring-purple-500 transition`}
      >
        <span className={`truncate ${selected ? "text-white" : "text-gray-400"}`}>
          {selected || "Seleccionar..."}
        </span>
        <svg
          className={`w-4 h-4 ml-2 transform transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full w-full mt-2 bg-[#0f1220] border border-gray-700 rounded-md shadow-lg z-50 max-h-44 overflow-y-auto py-1"
          >
            {opciones.map((op, idx) => {
              const label = String(op ?? "");
              return (
                <RoleOption
                  key={idx}
                  onClick={() => {
                    applyValue(op);
                  }}
                >
                  {label}
                </RoleOption>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* error */}
      {errors[nombre] && (
        <span className="text-red-400 text-sm mt-1">
          {String(errors[nombre]?.message ?? "")}
        </span>
      )}
    </label>
  );
}

export default Select;
