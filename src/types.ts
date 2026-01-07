import { type FieldErrors, type FieldValues, type Path, type PathValue, type UseFormRegisterReturn, type UseFormSetValue } from "react-hook-form";

export interface RegisterFormInputs {
    nombre: string;
    apellido: string;
    telefono: number;
    cedula: number;
    clave: string;
    confirmarPassword: string;
}

export interface LoginFormInputs {
    cedula: number;
    clave: string;
}
export interface FormData {
  nombre: string;
  apellido: string;
  telefono: string;
  cedula: string;
  claveActual: string;
  claveNueva: string;
  foto?: string;
  rol: Rol
}

export interface contextType {
  logged: boolean
  setErrorCode: (code: number) => void
  setLoading: (status: boolean) => void
  setLogged: (status: boolean) => void
}

export enum Rol {
  'Paciente' = 'Paciente',
  'Vacunador' = 'Vacunador',
  'Administrador' = 'Administrador'
}

// Crear un componente tipado para agregar cada campo
// Creo una interfaz al que le puedo colocar cualquier tipo de dato T(generico)
export interface CampoProps<T extends FieldValues> {
    titulo: string; // es lo que aparece encima del input
    tipo: 'text' | 'number' | 'password' | 'email' | 'tel' | 'file'; // tipo de input
    placeholder: string; // texto que aparece dentro del input
    regis: UseFormRegisterReturn; // es el register de react-hook-form, para que podamos enviar los requisitos del campo
    errors: FieldErrors<T>; //es el objeto de errores 
    nombre: keyof T; // limitar al register para que solo acepte las llaves del formulario
}

export interface selectProps<T extends FieldValues> {
    titulo: string;
    regis: UseFormRegisterReturn;
    errors: FieldErrors<T>
    nombre: Path<T>;
    estilosAdicionales?: string;
    setValue: UseFormSetValue<T>;
    opciones: PathValue<T, Path<T>>[];
}