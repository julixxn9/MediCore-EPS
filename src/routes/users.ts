import bcrypt from 'bcrypt'
import { Router } from 'express'
import { ObjectId } from 'mongodb'
import { colPacientes } from '../index'
import { Paciente } from '../types'
import {
  resError,
  validarCedula,
  validarClave,
  validarCuerpo,
  validarFoto,
  validarNombreApellido,
  validarTelefono
} from '../utils/validaciones'

const paciente = Router()

// Obtener todos los pacientes
paciente.get('/', async (_, res) => {
  try {
    const resultado = await colPacientes.find().toArray()
    return res.status(200).json(resultado)
  } catch (error) {
    console.error('Error al obtener pacientes:', error)
    return res.status(500).json('error interno del servidor')
  }
})

// Obtener un paciente por ID o cédula
paciente.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    let resultado: Paciente | null = null

    if (ObjectId.isValid(id)) {
      resultado = await colPacientes.findOne({ _id: new ObjectId(id) }) as Paciente | null
    }

    if (resultado == null && !isNaN(Number(id))) {
      const cedula = Number(id)
      resultado = await colPacientes.findOne({ cedula }) as Paciente | null
    }

    if (resultado == null) {
      resError(404, 'Paciente no encontrado')
    }

    return res.status(200).json(resultado)
  } catch (error) {
    const e = error as Error
    if (e.message.startsWith('{')) {
      const objetoError = JSON.parse(e.message)
      return res.status(objetoError.codigo).json(objetoError.mensaje)
    }
    return res.status(500).json('error interno del servidor')
  }
})

// Crear paciente
paciente.post('/', async (req, res) => {
  try {
    const body = req.body
    validarCuerpo(body, false)
    const { nombre, apellido } = validarNombreApellido(body)
    const telefono = validarTelefono(body.telefono)
    const cedula = await validarCedula(body.cedula, false) // false → no debe existir
    const foto = validarFoto(body.foto)
    const clave = validarClave(body.clave)

    const _id = new ObjectId()

    const sal = await bcrypt.genSalt(10) // generar sal (numero aleatorio para el hash)
    const claveHash = await bcrypt.hash(clave, sal) // hashear la clave con la sal

    const nuevoPaciente: Paciente = {
      _id,
      nombre,
      apellido,
      telefono,
      cedula,
      foto,
      clave: claveHash,
      vacunas: []
    }

    await colPacientes.insertOne(nuevoPaciente)
    console.log(`Nuevo paciente creado: ${JSON.stringify(nuevoPaciente)}`)
    return res.status(201).json({ ...nuevoPaciente, _id: _id.toString() })
  } catch (error) {
    const e = error as Error
    if (e.message.startsWith('{')) {
      const objetoError = JSON.parse(e.message)
      return res.status(objetoError.codigo).json(objetoError.mensaje)
    }
    return res.status(500).json('error interno del servidor')
  }
})

// Actualizar paciente
paciente.put('/:id', async (req, res) => {
  try {
    const { id: _id } = req.params // puede ser ObjectId o cédula

    // Buscar al paciente según tipo de identificador
    let posiblePaciente: Paciente | null = null
    if (ObjectId.isValid(_id)) {
      posiblePaciente = await colPacientes.findOne({ _id: new ObjectId(_id) }) as Paciente
    } else {
      const cedula = await validarCedula(_id, true) // true → debe existir
      posiblePaciente = await colPacientes.findOne({ cedula }) as Paciente
    }

    if (posiblePaciente == null) {
      return res.status(404).json('Paciente no encontrado')
    }

    // Validar cuerpo y campos principales
    validarCuerpo(req.body, false)
    const cedula = await validarCedula(req.body.cedula, true) // true → debe existir
    const { nombre, apellido } = validarNombreApellido(req.body)
    const telefono = validarTelefono(req.body.telefono)
    // const foto = validarFoto(req.body.foto)
    const claveActual = validarClave(req.body.claveActual)
    const claveNueva = validarClave(req.body.claveNueva)

    // Verificar que la cédula no pertenezca a otro usuario
    if (ObjectId.isValid(_id)) {
      const otroPaciente = await colPacientes.findOne({
        cedula,
        _id: { $ne: new ObjectId(_id) }
      }) as Paciente | null

      if (otroPaciente !== null) {
        return res.status(409).json('La cédula ya está registrada en otro paciente')
      }
    } else {
      if (posiblePaciente.cedula !== cedula) {
        const otroPaciente = await colPacientes.findOne({ cedula }) as Paciente | null
        if ((otroPaciente != null) && otroPaciente.cedula !== posiblePaciente.cedula) {
          return res.status(409).json('La cédula ya está registrada en otro paciente')
        }
      }
    }

    // Validar la clave actual
    const esValida = await bcrypt.compare(claveActual, posiblePaciente.clave)
    if (!esValida) {
      return res.status(401).json('La clave actual es incorrecta')
    }

    // Encriptar la nueva clave
    const salt = await bcrypt.genSalt(10)
    const claveHash = await bcrypt.hash(claveNueva, salt)

    // Crear el objeto con los datos actualizados
    const pacienteActualizado: Omit<Paciente, '_id' | 'vacunas' | 'foto'> = {
      nombre,
      apellido,
      telefono,
      cedula,
      clave: claveHash
    }

    // Obtener el ObjectId real del paciente (soporte mixto)
    const idPaciente = ObjectId.isValid(_id)
      ? new ObjectId(_id)
      : posiblePaciente._id

    // Actualizar en la base de datos
    await colPacientes.updateOne(
      { _id: idPaciente },
      { $set: pacienteActualizado }
    )
    return res.status(200).json('Paciente actualizado correctamente')
  } catch (error) {
    console.log('Error en PUT /pacientes/:id =>', error)
    const e = error as Error
    if (e.message.startsWith('{')) {
      const objetoError = JSON.parse(e.message)
      return res.status(objetoError.codigo).json(objetoError.mensaje)
    }
    return res.status(500).json('Error interno del servidor')
  }
})

// Actualizar solo la foto del paciente
paciente.put('/foto/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { foto } = req.body

    if (!ObjectId.isValid(id)) return res.status(400).json('ID inválido')
    if (foto == null) return res.status(400).json('Foto requerida')

    await colPacientes.updateOne(
      { _id: new ObjectId(id) },
      { $set: { foto } }
    )

    return res.status(200).json('Foto actualizada correctamente')
  } catch (error) {
    console.error(error)
    return res.status(500).json('Error al actualizar foto')
  }
})

// Eliminar paciente
paciente.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) {
      resError(400, 'ID de paciente inválido')
    }

    const paciente = await colPacientes.findOne({ _id: new ObjectId(id) }) as Paciente | null
    if (paciente == null) {
      resError(404, 'Paciente no encontrado')
    }

    const resultado = await colPacientes.deleteOne({ _id: new ObjectId(id) })
    if (resultado.deletedCount === 0) {
      resError(404, 'Paciente no encontrado')
    }

    return res.status(200).json('Paciente eliminado correctamente')
  } catch (error) {
    const e = error as Error
    if (e.message.startsWith('{')) { // startsWith para verificar si el mensaje es un JSON
      const objetoError = JSON.parse(e.message)
      return res.status(objetoError.codigo).json(objetoError.mensaje)
    }
    return res.status(500).json('error interno del servidor')
  }
})

export default paciente
