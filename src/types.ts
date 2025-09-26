import { ObjectId } from 'mongodb'

// export type Vacunas = 'COVID-19' | 'Influenza' | 'Varicela' | 'Sarampión' | 'Rubeola' | 'VPH'

export enum Vacunas {
  'COVID-19' = 'COVID-19',
  Influenza = 'Influenza',
  Varicela = 'Varicela',
  Sarampión = 'Sarampión',
  Rubeola = 'Rubeola',
  VPH = 'VPH'
}

// Interfaz que representa una vacuna administrada a un paciente
export interface Vacuna {
  _id: ObjectId
  fechaAplicacion: Date
  cedula: number
  vacuna: Vacunas
  vacunador: string
  lugar: string
}

// Interfaz que representa un paciente
export interface Paciente {
  _id: ObjectId
  nombre: string
  apellido: string
  foto: string
  cedula: number
  telefono: number
  clave: string
  vacunas: Vacuna[]
}

export type ERRORFunc<T> = (dato: T) => false | { error: string }
