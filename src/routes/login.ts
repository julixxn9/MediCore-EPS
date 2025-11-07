import { Router } from 'express'
import bcrypt from 'bcrypt'
import { colPacientes } from '../index'
import { Paciente } from '../types'
import { resError, validarCedula, validarClave, validarCuerpo } from '../utils/validaciones'

const login = Router()

login.post('/login', async (req, res) => {
  console.log('Intento de login recibido')
  console.log('Cookies recibidas:', req.cookies)
  try {
    const session = req.cookies.session
    if (session != null) {
      console.log('Sesión encontrada:', session)
      const posiblePaciente = await colPacientes.findOne({ cedula: Number(session) }) as Paciente | null
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      if (posiblePaciente == null) return resError(404, `Paciente no encontrado por cookie ${req.cookies.session}`)
      const pacienteRetornar: Omit<Paciente, 'clave' | '_id'> = posiblePaciente
      return res.status(200).json({
        message: 'Inicio de sesión exitoso',
        info: { ...pacienteRetornar, _id: posiblePaciente._id.toString() }
      })
    }

    const body = req.body
    validarCuerpo(body, false)
    const cedula = await validarCedula(body.cedula, true)
    const clave = validarClave(body.clave)

    const posiblePaciente = await colPacientes.findOne({ cedula }) as Paciente | null
    if (posiblePaciente == null) resError(404, 'Paciente no encontrado')

    const esValida = await bcrypt.compare(clave, posiblePaciente.clave)
    if (esValida == null) return resError(401, 'Credenciales inválidas')

    // Crear cookie HTTPOnly con la cédula
    res.cookie('session', cedula, {
      httpOnly: true,
      maxAge: 5 * 60 * 1000, // 5 minutos
      sameSite: 'lax'
    })

    const pacienteRetornar: Omit<Paciente, 'clave' | '_id'> = posiblePaciente

    console.log('Paciente autenticado:', cedula)
    return res.json({
      message: 'Inicio de sesión exitoso',
      info: { ...pacienteRetornar, _id: posiblePaciente._id.toString() }
    })
  } catch (error) {
    const e = error as Error
    console.log('Error en login:', e.message)
    if (e.message.startsWith('{')) {
      const objetoError = JSON.parse(e.message)
      return res.status(objetoError.codigo).json(objetoError.mensaje)
    }
    return res.status(500).json('Error interno del servidor')
  }
})

export default login
