import { Request, Response } from 'express'
import { resError, validarCedula, validarClave, validarCuerpo, validarToken } from '../utils/validaciones'
import { Paciente } from '../types'
import bcrypt from 'bcrypt'
import { colPacientes } from '..'
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { StringValue } from 'ms'
import { ObjectId } from 'mongodb'

dotenv.config()
const jwtSecret: string = process.env.JWT_SECRET as string
const jwtAccessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN as StringValue
const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN as StringValue
const cookieAccessExpiresIn = Number(process.env.COOKIE_ACCESS_EXPIRES_IN)
const cookieRefreshExpiresIn = Number(process.env.COOKIE_REFRESH_EXPIRES_IN)

export async function login (req: Request, res: Response): Promise<Response> {
  try {
    const body = req.body
    validarCuerpo(body, false)
    const cedula = await validarCedula(body.cedula, true)
    const clave = validarClave(body.clave)

    const posiblePaciente = await colPacientes.findOne({ cedula }) as Paciente | null

    if (posiblePaciente == null) {
      return resError(404, 'Paciente no encontrado')
    }

    const esValida = await bcrypt.compare(clave, posiblePaciente.clave)
    if (esValida == null) return resError(401, 'Credenciales inválidas')

    // Payload para access y refresh tokens

    const accessPayload: JwtPayload = {
      sub: posiblePaciente._id.toString(),
      cedula: posiblePaciente.cedula,
      nombre: posiblePaciente.nombre,
      apellido: posiblePaciente.apellido
    }

    const refreshPayload: JwtPayload = {
      sub: posiblePaciente._id.toString()
    }

    const accessToken = jwt.sign(accessPayload, jwtSecret, {
      expiresIn: jwtAccessExpiresIn
    })
    const refreshToken = jwt.sign(refreshPayload, jwtSecret, {
      expiresIn: jwtRefreshExpiresIn
    })

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: cookieAccessExpiresIn
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: cookieRefreshExpiresIn
    })

    return res.json({
      msg: 'Inicio de sesion exitoso'
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
}

export async function refresh (req: Request, res: Response): Promise<Response> {
  try {
    const { refreshToken } = req.cookies

    if (refreshToken == null) {
      return resError(401, 'No estás autenticado. Inicia sesión.')
    }

    let posiblePaciente: Paciente | null = null
    const userID: string = validarToken(refreshToken).sub as string

    posiblePaciente = await colPacientes.findOne({ _id: new ObjectId(userID) })

    if (posiblePaciente == null) {
      return resError(404, 'Paciente no encontrado')
    }

    const newAccessPayload: JwtPayload = {
      sub: posiblePaciente._id.toString(),
      cedula: posiblePaciente.cedula,
      nombre: posiblePaciente.nombre,
      apellido: posiblePaciente.apellido
    }

    const newAccessToken = jwt.sign(newAccessPayload, jwtSecret, {
      expiresIn: jwtAccessExpiresIn
    })

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: cookieAccessExpiresIn
    })
  } catch (error) {
    const e = error as Error
    console.log('Error en refresh:', e.message)
    if (e.message.startsWith('{')) {
      const objetoError = JSON.parse(e.message)
      return res.status(objetoError.codigo).json(objetoError.mensaje)
    }
    return res.status(500).json('Error interno del servidor')
  }
  return res.json({ msg: 'Token de acceso renovado exitosamente' })
}
