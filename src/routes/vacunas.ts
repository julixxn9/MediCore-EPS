/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/keyword-spacing */
/* eslint-disable @typescript-eslint/indent */
import { Router } from 'express'
import { ObjectId } from 'mongodb'
import { colPacientes, colVacunas } from '../index'
import { Vacuna, Vacunas } from '../types'

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
    const { id } = req.params
    const cedula = Number(id)

    try {
        // Validar cédula
        if (isNaN(cedula)) {
            return res.status(400).json({ message: 'Cédula inválida: debe ser un número' })
        }
        if (cedula <= 0 || cedula.toString().length < 5 || cedula.toString().length > 10) {
            return res.status(400).json({ message: 'Cédula inválida: debe ser mayor a 0 y tener entre 5 y 10 dígitos' })
        }

        // Buscar vacunas por cédula
        const vacunasPorCedula = await colVacunas.find({ cedula }).toArray() as Vacuna[]

        if (vacunasPorCedula.length > 0) {
            return res.json({ message: vacunasPorCedula })
        } else {
            return res.json({ message: `La cédula ${cedula} no tiene vacunas registradas.` })
        }
    } catch (error) {
        console.error('Error al obtener vacunas por cédula:', error)
        return res.status(500).json({ message: 'Error interno del servidor' })
    }
})
// Registrar una nueva vacuna para un paciente
vacunas.post('/:id', async (req, res) => {
    const { id } = req.params
    const cedula = Number(id)

    try {
        // Validar cédula
        if (isNaN(cedula)) {
            return res.status(400).json({ message: 'Cédula inválida: debe ser un número' })
        }
        if (cedula <= 0 || cedula.toString().length < 5 || cedula.toString().length > 10) {
            return res.status(400).json({ message: 'Cédula inválida: debe ser mayor a 0 y tener entre 5 y 10 dígitos' })
        }

        // Validar body
        if (req.body == null || typeof req.body !== 'object' || Array.isArray(req.body)) {
            return res.status(400).json({ message: 'Cuerpo de la solicitud inválido' })
        }

        const { nombreVacuna, fechaVacuna, nombreVacunador, lugarVacunacion } = req.body

        // Validar campos requeridos
        if (nombreVacuna == null || fechaVacuna == null || nombreVacunador == null || lugarVacunacion == null) {
            return res.status(400).json({ message: 'Faltan datos: nombre Vacuna, fecha Vacuna, nombre Vacunador y lugar Vacunacion son obligatorios' })
        }

        // Validar nombreVacunador
        if (typeof nombreVacunador !== 'string' || nombreVacunador.trim() === '') {
            return res.status(400).json({ message: 'El nombre del vacunador es obligatorio y debe ser un string no vacío' })
        }

        // Validar nombreVacuna dentro de las permitidas
        if (!Object.values(Vacunas).includes(nombreVacuna)) { // esto quiere decir que no es ninguna de las vacunas permitidas
            return res.status(400).json({ message: `Vacuna inválida. Las vacunas permitidas son: ${Object.values(Vacunas).join(', ')}` })
        }

        // Validar lugar
        if (typeof lugarVacunacion !== 'string' || lugarVacunacion.trim() === '') {
            return res.status(400).json({ message: 'El lugar de vacunación es obligatorio y debe ser un string no vacío' })
        }

        // Validar fecha
        const fecha = new Date(fechaVacuna)
        if (isNaN(fecha.getTime())) {
            return res.status(400).json({ message: 'Fecha de vacuna inválida' })
        }

        // Crear objeto vacuna según el tipo definido
        const nuevaVacuna: Vacuna = {
            _id: new ObjectId(),
            fechaAplicacion: fecha,
            cedula,
            vacuna: nombreVacuna as Vacunas, // Aseguramos que es del tipo Vacunas
            vacunador: `${nombreVacunador}`.trim(), // Convertir a string y limpiar espacios
            lugar: lugarVacunacion.trim() // Limpiar espacios
        }

        // Insertar en base de datos
        const resultadoVacunas = await colVacunas.insertOne(nuevaVacuna)

        // Actualizar el arreglo de vacunas del paciente
        const resultadoPacientes = await colPacientes.updateOne(
            { cedula },
            { $push: { vacunas: nuevaVacuna } }
        )

        // Verificar si se actualizó algún paciente
        if (resultadoPacientes.matchedCount === 0) {
            return res.status(404).json({ message: `No se encontró un paciente con la cédula ${cedula}` })
        }

        return res.status(201).json({
            message: 'Vacuna registrada exitosamente',
            insertedId: resultadoVacunas.insertedId,
            // se entrega como id de la vacuna el que genera MongoDB en vez del object directamente si no convertido a string para el usuario
            data: { ...nuevaVacuna, _id: nuevaVacuna._id.toString() },
            pacienteActualizado: resultadoPacientes.matchedCount > 0
        })
    } catch (error) {
        console.error('Error al registrar vacuna:', error)
        return res.status(500).json({ message: 'Error interno del servidor' })
    }
})

// Registrar varias vacunas para un paciente
vacunas.post('/:id/multiples', async (req, res) => {
  const { id } = req.params
  const cedula = Number(id)

  try {
    // Validar cédula
    if (cedula == null || isNaN(cedula)) {
      return res.status(400).json({ message: 'Cédula inválida: debe ser un número' })
    }
    if (cedula <= 0 || cedula.toString().length < 5 || cedula.toString().length > 10) {
      return res.status(400).json({ message: 'Cédula inválida: debe ser mayor a 0 y tener entre 5 y 10 dígitos' })
    }

    if (req.body == null) {
        return res.status(400).json({ message: 'Cuerpo de la solicitud inválido' })
    }

    // Validar body como arreglo
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ message: 'El cuerpo debe ser un arreglo con al menos una vacuna' })
    }

    const vacunasARegistrar: Vacuna[] = []

    for (const vacuna of req.body) {
      const { nombreVacuna, fechaVacuna, nombreVacunador, lugarVacunacion } = vacuna

      // Validar campos requeridos
      if (nombreVacuna == null || fechaVacuna == null || nombreVacunador == null || lugarVacunacion == null) {
        return res.status(400).json({ message: 'Faltan datos en una de las vacunas' })
      }

      // Validar nombreVacunador
      if (typeof nombreVacunador !== 'string' || nombreVacunador.trim() === '') {
        return res.status(400).json({ message: 'El nombre del vacunador es obligatorio y debe ser un string no vacío' })
      }

      // Validar vacuna dentro de las permitidas
      if (!Object.values(Vacunas).includes(nombreVacuna)) {
        return res.status(400).json({ message: `Vacuna inválida (${nombreVacuna}). Permitidas: ${Object.values(Vacunas).join(', ')}` })
      }

      // Validar lugar
      if (typeof lugarVacunacion !== 'string' || lugarVacunacion.trim() === '') {
        return res.status(400).json({ message: 'El lugar de vacunación es obligatorio y debe ser un string no vacío' })
      }

      // Validar fecha
      const fecha = new Date(fechaVacuna)
      if (isNaN(fecha.getTime())) {
        return res.status(400).json({ message: 'Fecha de vacuna inválida' })
      }

      // Construir vacuna válida
      vacunasARegistrar.push({
        _id: new ObjectId(),
        fechaAplicacion: fecha,
        cedula,
        vacuna: nombreVacuna as Vacunas,
        vacunador: nombreVacunador.trim(),
        lugar: lugarVacunacion.trim()
      })
    }

    // Insertar todas las vacunas en la colección de vacunas
    const resultadoVacunas = await colVacunas.insertMany(vacunasARegistrar)

    // Actualizar el arreglo de vacunas del paciente
    const resultadoPacientes = await colPacientes.updateOne(
      { cedula },
      { $push: { vacunas: { $each: vacunasARegistrar } } }
    )

    if (resultadoPacientes.matchedCount === 0) {
      return res.status(404).json({ message: `No se encontró un paciente con la cédula ${cedula}` })
    }

    return res.status(201).json({
      message: 'Vacunas registradas exitosamente',
      insertedCount: resultadoVacunas.insertedCount,
      // se entrega como id de la vacuna el que genera MongoDB en formato string para el usuario
      data: vacunasARegistrar.map(vacuna => ({
        ...vacuna,
        _id: vacuna._id.toString()
      })),
      pacienteActualizado: resultadoPacientes.matchedCount > 0
    })
  } catch (error) {
    console.error('Error al registrar múltiples vacunas:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
})

export default vacunas
