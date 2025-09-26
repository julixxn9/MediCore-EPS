import { Router } from 'express'
import { validarCedula } from '../utils/validaciones'
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

  const errorCedula = validarCedula(cedula)
  if (errorCedula !== undefined) {
    return res.status(400).json({ message: 'Cédula inválida: entre 5 y 10 dígitos' })
  }
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
