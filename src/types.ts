import { ObjectId } from 'mongodb'

export type Vacunas = 'COVID-19' | 'Influenza' | 'Varicela' | 'Sarampión' | 'Rubeola' | 'VPH'

// Interfaz que representa una vacuna administrada a un paciente
export interface Vacuna {
  _id: ObjectId
  fechaAplicacion: Date
  paciente: ObjectId
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
