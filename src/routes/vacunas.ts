import { Router } from 'express'
import { colPacientes, colVacunas } from '../index'
import { Vacuna } from '../types'
import { resError, validarCedula, validarCuerpo, validarMultiplesVacunas, validarVacuna } from '../utils/validaciones'

const vacunas = Router()

// Obtener todas las vacunas
vacunas.get('/', async (_, res) => {
  try {
    const resultado = await colVacunas.find().toArray()
    return res.json({ message: resultado })
  } catch (error) {
    console.error('Error al obtener vacunas:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// Obtener vacunas por cédula del paciente

vacunas.get('/:id', async (req, res) => {
  try {
    const cedula = await validarCedula(Number(req.params.id), true)
    const vacunasPorCedula = await colVacunas.find({ cedula }).toArray() as Vacuna[]
    if (vacunasPorCedula.length > 0) {
      return res.json({ message: vacunasPorCedula })
    }
    return res.json({ message: `La cédula ${cedula} no tiene vacunas registradas.` })
  } catch (error: any) {
    const { codigo, mensaje } = JSON.parse(error.message)
    return res.status(codigo).json({ message: mensaje })
  }
})

// Registrar una nueva vacuna
vacunas.post('/:id', async (req, res) => {
  try {
    const cedula = await validarCedula(Number(req.params.id), true)
    validarCuerpo(req.body)

    const nuevaVacuna = validarVacuna(req.body, cedula)
    const resultadoVacunas = await colVacunas.insertOne(nuevaVacuna)

    const resultadoPacientes = await colPacientes.updateOne(
      { cedula },
      { $push: { vacunas: nuevaVacuna } }
    )

    if (resultadoPacientes.matchedCount === 0) {
      resError(404, `No se encontró un paciente con la cédula ${cedula}`)
    }

    return res.status(201).json({
      message: 'Vacuna registrada exitosamente',
      insertedId: resultadoVacunas.insertedId,
      data: { ...nuevaVacuna, _id: nuevaVacuna._id.toString() }
    })
  } catch (error: any) {
    const { codigo, mensaje } = JSON.parse(error.message)
    return res.status(codigo).json({ message: mensaje })
  }
})

// Registrar múltiples vacunas
vacunas.post('/:id/multiples', async (req, res) => {
  try {
    const cedula = await validarCedula(Number(req.params.id), true)
    validarCuerpo(req.body, true)

    const vacunasARegistrar = validarMultiplesVacunas(req.body, cedula)
    const resultadoVacunas = await colVacunas.insertMany(vacunasARegistrar)

    const resultadoPacientes = await colPacientes.updateOne(
      { cedula },
      { $push: { vacunas: { $each: vacunasARegistrar } } }
    )

    if (resultadoPacientes.matchedCount === 0) {
      resError(404, `No se encontró un paciente con la cédula ${cedula}`)
    }

    return res.status(201).json({
      message: 'Vacunas registradas exitosamente',
      insertedCount: resultadoVacunas.insertedCount,
      data: vacunasARegistrar.map(v => ({ ...v, _id: v._id.toString() }))
    })
  } catch (error: any) {
    const { codigo, mensaje } = JSON.parse(error.message)
    return res.status(codigo).json({ message: mensaje })
  }
})

export default vacunas
