import { ObjectId } from 'mongodb'
import { colPacientes } from '../index'
import { Vacuna, Vacunas } from '../types'

// ---------------- UTILIDAD GENERAL ----------------

// función generadora de errores intencionales
export function resError (codigo: number, mensaje: string): never {
  throw new Error(JSON.stringify({ codigo, mensaje }))
}

// valida que el cuerpo no sea nulo y tenga el formato esperado
export function validarCuerpo (cuerpo: unknown, debeSerArray = false): void | never {
  if (cuerpo == null) {
    resError(400, 'falta un cuerpo en la petición')
  }
  if (typeof cuerpo !== 'object') {
    resError(400, 'el cuerpo de la petición no es válido')
  }
  if (!debeSerArray && Array.isArray(cuerpo)) {
    resError(400, 'se esperaba un objeto, no un arreglo')
  }
  if (debeSerArray && !Array.isArray(cuerpo)) {
    resError(400, 'se esperaba un arreglo en el cuerpo')
  }
}

// ---------------- VALIDACIONES PACIENTE ----------------

// valida nombre y apellido
export function validarNombreApellido (cuerpo: object): { nombre: string, apellido: string } | never {
  if (Object.hasOwn(cuerpo, 'nombre') && Object.hasOwn(cuerpo, 'apellido')) {
    const nombre = (cuerpo as any).nombre
    const apellido = (cuerpo as any).apellido
    if (typeof nombre !== 'string' || typeof apellido !== 'string') {
      resError(400, 'nombre y apellido deben ser cadenas de texto')
    }
    if (nombre.trim().length === 0 || apellido.trim().length === 0) {
      resError(400, 'nombre y apellido no pueden estar vacíos')
    }
    return { nombre: nombre.trim(), apellido: apellido.trim() }
  } else {
    resError(400, 'falta el nombre o apellido en el cuerpo de la petición')
  }
}

// valida teléfono
export function validarTelefono (telefono: unknown): number | never {
  if (telefono == null) {
    resError(400, 'falta el teléfono en el cuerpo de la petición')
  }
  const telefonoNum = Number(telefono)
  if (typeof telefonoNum !== 'number' || !Number.isInteger(telefonoNum)) {
    resError(400, 'teléfono inválido: debe ser un número entero')
  }
  if (telefonoNum <= 0 || telefonoNum.toString().length !== 10) {
    resError(400, 'teléfono inválido: debe tener 10 dígitos')
  }
  return telefonoNum
}

// valida cédula
export async function validarCedula (cedula: unknown, deberiaExistir: boolean): never | Promise<number> {
  if (cedula == null) {
    resError(400, 'falta la cédula en el cuerpo de la petición')
  }

  const cedulaNumerica = Number(cedula)
  if (typeof cedulaNumerica !== 'number' || !Number.isInteger(cedulaNumerica) || isNaN(cedulaNumerica)) {
    resError(400, 'cédula inválida: debe ser un número entero')
  }

  const existe = await existeCedula(cedulaNumerica)
  if (!deberiaExistir && existe) {
    resError(409, 'La cédula ya está registrada')
  }
  if (deberiaExistir && !existe) {
    resError(404, 'La cédula no está registrada')
  }

  return cedulaNumerica
}

export async function existeCedula (cedula: number): Promise<boolean> | never {
  const cedulaExiste = await colPacientes.findOne({ cedula })
  console.log(cedulaExiste)
  return cedulaExiste != null
}

// validar clave (contraseña)
export function validarClave (clave: any): string {
  if (typeof clave !== 'string') {
    resError(400, 'La clave debe ser una cadena de texto')
  }

  if (clave.length < 6 || clave.length > 20) {
    resError(400, 'La clave debe tener entre 6 y 20 caracteres')
  }

  const regex = /^(?=.*[A-Za-z])(?=.*\d).+$/
  if (!regex.test(clave)) {
    resError(400, 'La clave debe contener al menos una letra y un número')
  }

  return clave
}

// validar foto (URL o base64)
export function validarFoto (foto: any): string {
  if (typeof foto !== 'string' || foto.trim() === '') {
    resError(400, 'La foto es obligatoria y debe ser texto')
  }

  // eslint-disable-next-line no-useless-escape
  const urlRegex = /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/
  const base64Regex = /^data:image\/(png|jpg|jpeg);base64,/

  if (!urlRegex.test(foto) && !base64Regex.test(foto)) {
    resError(400, 'La foto debe ser una URL válida o una cadena base64')
  }

  return foto
}

// ---------------- VALIDACIONES VACUNAS ----------------

// validar campos de una vacuna
export function validarVacuna (input: any, cedula: number): Vacuna {
  const { nombreVacuna, fechaVacuna, nombreVacunador, lugarVacunacion } = input

  // Validar campos requeridos
  if (nombreVacuna == null || fechaVacuna == null || nombreVacunador == null || lugarVacunacion == null) {
    resError(400, 'Faltan datos: nombreVacuna, fechaVacuna, nombreVacunador y lugarVacunacion son obligatorios')
  }

  if (typeof nombreVacunador !== 'string' || nombreVacunador.trim() === '') {
    resError(400, 'El nombre del vacunador es obligatorio y debe ser un string no vacío')
  }

  if (!Object.values(Vacunas).includes(nombreVacuna)) {
    resError(400, `Vacuna inválida. Permitidas: ${Object.values(Vacunas).join(', ')}`)
  }

  if (typeof lugarVacunacion !== 'string' || lugarVacunacion.trim() === '') {
    resError(400, 'El lugar de vacunación es obligatorio y debe ser un string no vacío')
  }

  const fecha = new Date(fechaVacuna)
  if (isNaN(fecha.getTime())) {
    resError(400, 'Fecha de vacuna inválida')
  }

  return {
    _id: new ObjectId(),
    fechaAplicacion: fecha,
    cedula,
    vacuna: nombreVacuna as Vacunas,
    vacunador: nombreVacunador.trim(),
    lugar: lugarVacunacion.trim()
  }
}

// validar un array de vacunas
export function validarMultiplesVacunas (cuerpo: any[], cedula: number): Vacuna[] {
  if (!Array.isArray(cuerpo) || cuerpo.length === 0) {
    resError(400, 'El cuerpo debe ser un arreglo con al menos una vacuna')
  }
  return cuerpo.map(v => validarVacuna(v, cedula))
}

// ---------------- VALIDACIONES LOGIN ----------------

// validar coincidencia de claves
export function validarCoincidenciaClaves (clave: string, confirmarClave: string): void | never {
  if (clave !== confirmarClave) {
    resError(400, 'La confirmacion de la clave no coincide con la clave')
  }
}
