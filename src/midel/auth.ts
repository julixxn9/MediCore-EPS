import { Request, Response, NextFunction } from 'express'
import { resError } from '../utils/validaciones'

export function auth (req: Request, res: Response, next: NextFunction): void {
  const cedula = req.cookies?.session

  if (cedula == null) {
    resError(401, 'No estás autenticado. Inicia sesión.')
  }

  // Guardamos cedula para usarla en la ruta
  (req as any).cedulaSesion = Number(cedula)
  next()
}
