// src/context/ProfileContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { FormData } from "../types";

type ProfileContextType = {
  profile: FormData | null;
  loading: boolean;
  openEdit: boolean;
  setOpenEdit: (v: boolean) => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<FormData>) => Promise<FormData | null>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
};

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<FormData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [openEdit, setOpenEdit] = useState<boolean>(false);

  const getIdFromStorage = () => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      const u = JSON.parse(raw);
      // soporta _id o cedula
      return u._id ?? u.cedula ?? null;
    } catch {
      return null;
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    const id = getIdFromStorage();
    if (!id) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND}EPS/pacientes/${id}`);
      if (!res.ok) {
        console.error("No se pudo obtener profile:", await res.text());
        setProfile(null);
      } else {
        const json = await res.json();
        // según tu backend devuelve { message: resultado }
        const payload = json?.message ?? json;
        setProfile({
          nombre: payload.nombre ?? "",
          apellido: payload.apellido ?? "",
          telefono: String(payload.telefono ?? ""),
          cedula: String(payload.cedula ?? ""),
          claveActual: "",
          claveNueva: "",
          foto: payload.foto ?? "",
          rol: payload.rol ?? ("Paciente"),
        });
      }
    } catch (error) {
      console.error("Error fetchProfile", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  const updateProfile = async (data: Partial<FormData>) => {
    if (!profile) return null;
    try {
      const id = getIdFromStorage();
      if (!id) throw new Error("No user id available");
      const res = await fetch(`${import.meta.env.VITE_BACKEND}EPS/pacientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error al actualizar");
      }
      const json = await res.json();
      const updated = json?.message ?? json;
      const newProfile: FormData = {
        nombre: updated.nombre ?? profile.nombre,
        apellido: updated.apellido ?? profile.apellido,
        telefono: String(updated.telefono ?? profile.telefono),
        cedula: String(updated.cedula ?? profile.cedula),
        claveActual: "",
        claveNueva: "",
        foto: updated.foto ?? profile.foto,
        rol: updated.rol ?? profile.rol,
      };
      setProfile(newProfile);
      // también actualizar localStorage user si aplica
      try {
        const raw = localStorage.getItem("user");
        if (raw) {
          const u = JSON.parse(raw);
          const merged = { ...u, ...newProfile };
          localStorage.setItem("user", JSON.stringify(merged));
        }
      } catch (error) {
        console.log(error)
      }
      return newProfile;
    } catch (error) {
      console.error("updateProfile error", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        openEdit,
        setOpenEdit,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
