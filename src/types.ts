import { type FieldErrors, type FieldValues, type UseFormRegisterReturn } from "react-hook-form";

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