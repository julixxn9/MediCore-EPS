import { Request, Response, NextFunction } from 'express'
import { resError, responseToError, validarToken } from '../utils/validaciones'
import dotenv from 'dotenv'
import { middleware, Rol } from '../types'

dotenv.config()

export function authVerify (necesitoLogin: boolean): middleware<Response | undefined> {
  return (req, res, next) => {
    try {
      const { accessToken } = req.cookies
      if (accessToken == null) {
        if (necesitoLogin) {
          resError(401, 'No estás autenticado. Inicia sesión.')
        } else {
          const rolPorDefecto: Rol = Rol.Paciente
          res.locals.usuario = {}
          res.locals.usuario.rol = rolPorDefecto
          next()
        }
      }
    } catch (error) {
      return responseToError(error as Error, res)
    }
  }
}

export function authRole (req: Request, res: Response, next: NextFunction): Response | undefined {
  try {
    const { accessToken } = req.cookies

    if (accessToken == null) {
      const rolPorDefecto: Rol = Rol.Paciente
      res.locals.usuario.rol = rolPorDefecto
      next()
    }
    res.locals.usuario = validarToken(accessToken)
    next()
  } catch (error) {
    return responseToError(error as Error, res)
  }
}
