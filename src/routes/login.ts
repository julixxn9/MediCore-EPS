import { Router } from 'express'
// import { ObjectId } from 'mongodb'
// import { colPacientes } from '../index'
// import { Paciente } from '../types'
import { colPacientes } from '../index'
import { Paciente } from '../types'
import { resError, validarCedula, validarClave, validarCoincidenciaClaves, validarCuerpo } from '../utils/validaciones'

const login = Router()

login.post('/', async (req, res) => {
  try {
    const body = req.body
    validarCuerpo(body, false)
    const cedula = await validarCedula(body.cedula, true) // true porque es login, no registro
    const clave = validarClave(body.clave)
    // si llega hasta aquí, es porque cedula y clave son válidos
    // ahora se verifica si la cedula y clave coinciden con algún paciente en la BD
    const posiblePaciente: Paciente | null = await colPacientes.findOne({ cedula })
    if (posiblePaciente == null) {
      resError(404, 'Paciente no encontrado')
    }
    validarCoincidenciaClaves(posiblePaciente.clave, clave)

    res.json({
      message: 'Bienvenido ' + posiblePaciente?.nombre,
      info: { ...posiblePaciente, _id: posiblePaciente._id.toString() } // convierto _id a string para evitar problemas en el frontend
    })
  } catch (error) {
    const e = error as Error
    if (e.message.startsWith('{')) {
      const objetoError = JSON.parse(e.message)
      return res.status(objetoError.codigo).json(objetoError.mensaje)
    }
    return res.status(500).json('error interno del servidor')
  }
})

export default login
