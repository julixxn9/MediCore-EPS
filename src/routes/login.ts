import { Router } from 'express'
import { cedulaValida } from '../utils/validaciones'
// import { colPacientes } from '../index'
// import { Paciente } from '../types'

const login = Router()

// Ruta de login
login.post('/', async (req, res) => {
  if (req.body == null || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ message: 'Body inválido: debe ser un objeto JSON' })
  }

  const { cedula, clave } = req.body as { cedula: number, clave: string }

  // Validar que cedula y clave estén presentes
  if (cedula == null || clave == null) {
    return res.status(400).json({ message: 'Cédula y clave son requeridos' })
  }

  const errorCedula = cedulaValida(cedula)
  if (errorCedula !== true) {
    return res.status(400).json(errorCedula)
  }

  try {
    // Validar cédula
    if (isNaN(cedula)) {
      return res.status(400).json({ message: 'Cédula inválida: debe ser un número' })
    }
  } catch (error) {
    // Validar cédula
    if (isNaN(cedula)) {
      return res.status(400).json({ message: 'Cédula inválida: debe ser un número' })
    }
  }
})
