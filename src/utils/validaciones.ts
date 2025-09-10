// Funciones de validación
export function cedulaValida (cedula: number): true | { error: string } {
  if (cedula <= 0 || cedula.toString().length < 5 || cedula.toString().length > 10) {
    return { error: 'Cédula inválida: debe ser mayor a 0 y tener entre 5 y 10 dígitos' }
  }
  return true
}
