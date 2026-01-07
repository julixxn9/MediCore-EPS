import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { colPacientes } from '..'
import { Rol, Paciente } from '../types'
import { resError, responseToError, validarCedula, validarClave, validarCuerpo, validarFoto, validarNombreApellido, validarRolAccion, validarRolDelBody, validarTelefono } from '../utils/validaciones'
dotenv.config()
const bycrypt = bcrypt

export async function getAllUsers (req: Request, res: Response): Promise<Response> {
  try {
    validarRolAccion(
      res.locals.usuario.rol,
      [
        Rol.Administrador
      ]
    )
    const resultado = await colPacientes.find({}, { projection: { vacunas: false, clave: false, foto: false } }).toArray() as Paciente[]
    return res.json(resultado)
  } catch (error) {
    return responseToError(error as Error, res)
  }
}

export async function getUserMe (req: any, res: Response): Promise<Response> {
  try {
    const resultado = await colPacientes.findOne({ _id: new ObjectId(res.locals.usuario.sub) }, { projection: { clave: false } }) as Paciente
    if (resultado == null) {
      throw new Error(JSON.stringify({ codigo: 404, mensaje: 'Paciente no encontrado' }))
    }
    return res.json(resultado)
  } catch (error) {
    responseToError(error as Error, res)
  }
  return res.status(500).json({ message: 'Error interno del servidor' })
}

export async function getUserByIdorCedula (req: any, res: Response): Promise<Response> {
  try {
    const { id } = req.params
    let resultado: Paciente | null = null

    // caso 1: si es un ObjectId válido
    if (ObjectId.isValid(id)) {
      resultado = await colPacientes.findOne({ _id: new ObjectId(id) })
    }

    // caso 2: si no es ObjectId válido, intentamos como cédula numérica
    if (resultado == null && !isNaN(Number(id))) {
      const cedula = Number(id)
      resultado = await colPacientes.findOne({ cedula }, { projection: { clave: false } })
    }

    if (resultado == null) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    return res.json({ message: resultado })
  } catch (error) {
    console.error('Error al obtener usuario:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export async function postUser (req: any, res: Response): Promise<Response> {
  try {
    const body = req.body
    validarCuerpo(body, false)
    const { nombre, apellido } = validarNombreApellido(body)
    const cedula = await validarCedula(body.cedula, false)
    const foto = validarFoto(req.file)
    const telefono = validarTelefono(body.telefono)
    const clave = validarClave(body.clave)
    let rolCuerpo: Rol

    if (res.locals.usuario.rol !== Rol.Administrador) {
      rolCuerpo = validarRolDelBody(
        body.rol,
        [
          Rol.Paciente
        ]
      )
    } else {
      rolCuerpo = validarRolDelBody(
        body.rol,
        [
          Rol.Paciente,
          Rol.Administrador,
          Rol.Vacunador
        ]
      )
    }

    const sal = await bcrypt.genSalt(10)
    const claveHash = await bycrypt.hash(clave, sal)

    const nuevoPaciente: Paciente = {
      _id: new ObjectId(),
      nombre,
      apellido,
      foto,
      cedula,
      telefono,
      clave: claveHash,
      vacunas: [],
      rol: rolCuerpo
    }

    await colPacientes.insertOne(nuevoPaciente)

    const usuarioFiltrado: Partial<Paciente> = nuevoPaciente

    delete usuarioFiltrado._id
    delete usuarioFiltrado.clave
    delete usuarioFiltrado.vacunas

    return res.json(usuarioFiltrado)
  } catch (error) {
    return responseToError(error as Error, res)
  }
}

export async function modifyFulluser (req: Request, res: Response): Promise<Response> {
  let posiblePaciente: Paciente | null = null
  const body = req.body
  const id = req.params.id as string
  try {
    if (ObjectId.isValid(id)) {
      posiblePaciente = await colPacientes.findOne({ _id: new ObjectId(id) }) as Paciente | null
    } else {
      const cedula = await validarCedula(Number(id), true)
      posiblePaciente = await colPacientes.findOne({ cedula }) as Paciente | null
    }
    if (posiblePaciente == null) {
      return res.status(404).json('Usuario no encontrado')
    }

    validarCuerpo(body, false)
    const cedula = await validarCedula(body.cedula, true)

    if (ObjectId.isValid(id)) {
      const otroPaciente = await colPacientes.findOne({ _id: new ObjectId(id), cedula }) as Paciente
      if (otroPaciente == null) {
        return resError(400, `La cédula ${cedula} ya está en uso por otro usuario`)
      }
    } else if (posiblePaciente.cedula !== cedula) {
      return resError(400, `La cédula ${cedula} ya está en uso por otro usuario`)
    }

    const { nombre, apellido } = validarNombreApellido(req.body)
    const telefono = validarTelefono(req.body.telefono)
    const foto = validarFoto(req.body.foto)
    const claveAnterior = validarClave(req.body.claveAnterior)
    const claveNueva = validarClave(req.body.claveNueva)
    let rolCuerpo: Rol

    if (res.locals.usuario.rol !== Rol.Administrador) {
      rolCuerpo = validarRolDelBody(
        req.body.rol,
        [
          Rol.Paciente
        ]
      )
    } else {
      rolCuerpo = validarRolDelBody(
        req.body.rol,
        [
          Rol.Paciente,
          Rol.Vacunador,
          Rol.Administrador
        ]
      )
    }

    const esValidaAnterior = await bcrypt.compare(claveAnterior, posiblePaciente.clave)
    if (esValidaAnterior == null) {
      resError(401, 'La confirmacionde la clave no coincide con la clave de la base de datos')
    }

    const sal = await bcrypt.genSalt(10)
    const claveHash = await bcrypt.hash(claveNueva, sal)

    const usuarioActualizado: Omit<Paciente, '_id' | 'vacunas'> = {
      nombre,
      apellido,
      foto,
      cedula,
      telefono,
      clave: claveHash,
      rol: rolCuerpo
    }

    const resultado = await colPacientes.updateOne({ _id: posiblePaciente._id }, { $set: usuarioActualizado })

    if (resultado.modifiedCount === 0) {
      resError(400, 'No se pudo actualizar el usuario')
    }

    const pacienteFiltrado: Partial<Paciente> = usuarioActualizado

    delete pacienteFiltrado.clave

    return res.json(pacienteFiltrado)
  } catch (error) {
    return responseToError(error as Error, res)
  }
}

export async function deleteUser (req: any, res: any): Promise<any> {
  try {
    const { id: _id } = req.params
    if (!ObjectId.isValid(_id)) {
      return res.status(400).json('ID de usuario inválido')
    }

    // Verificar si el usuario existe
    const usuario = await colPacientes.findOne({ _id: new ObjectId(_id) }, { projection: { clave: false } }) as Paciente
    if (usuario == null) {
      return res.status(404).json('Usuario no encontrado')
    }

    const resultado = await colPacientes.deleteOne({ _id: new ObjectId(_id) })

    if (resultado.deletedCount === 0) {
      return res.status(404).json('Usuario no encontrado')
    }

    return res.status(200).json('Usuario eliminado correctamente')
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    return res.status(500).json('Error interno del servidor')
  }
}
