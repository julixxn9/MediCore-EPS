import { Router } from 'express'
import { ObjectId } from 'mongodb'
import { colPacientes } from '../index'
import { Paciente } from '../types'

const paciente = Router()

// Obtener todos los pacientes
paciente.get('/', async (_, res) => {
  const resultado = await colPacientes.find().toArray()
  res.json({ message: resultado })
})

// Obtener un paciente por ID
paciente.get('/:id', async (req, res) => {
  try {
    const { id: _id } = req.params
    if (!ObjectId.isValid(_id)) {
      return res.status(400).json({ message: 'ID inválido' })
    }

    const resultado = await colPacientes.findOne({ _id: new ObjectId(_id) }) as Paciente

    if (resultado == null) {
      return res.status(404).json({ message: 'Paciente no encontrado' })
    }

    res.json({ message: resultado })
  } catch (error) {
    console.error('Error al obtener paciente:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

/* validaciones que hay que hacer.
  - el cuerpo es valido
  - el cuerpo tiene los campos requeridos
  - los campos tienen el tipo correcto
  - el cuerpo tiene
    -nombre
    -apellido
    -telefono
    -cedula
    -foto
    -clave
    -la cedula no esta repetida
    -la foto es una URL valida
    -la clave tiene al menos 6 caracteres
    los tipos de datos son correctos
    nombre debe tener minimo 2 caracteres
    no se valen numeros negativos ni 0
    telefono debe tener 10 caracteres
    cedula debe tener 5 caracteres maximo 10

    al crear un nuevo paciente, las vacunas deben ser del tipo Vacuna[]
    // el _id debe ser un ObjectId
  */
// Agregar un nuevo paciente
paciente.post('/', async (req, res) => {
  try {
    // keys es para validar que el cuerpo de la petición tenga los campos requeridos
    // funciona de manera similar a un esquema de validación
    if (req.body == null || Object.keys(req.body).length === 0) {
      return res.status(400).json('El cuerpo de la petición está vacío')
    }

    const { nombre, apellido, telefono, cedula, foto, clave, vacunas } = req.body

    // Validaciones
    if (typeof nombre !== 'string' || nombre.trim().length < 2) {
      return res.status(400).json('Nombre inválido (mínimo 2 caracteres)')
    }

    if (typeof apellido !== 'string' || apellido.trim().length < 2) {
      return res.status(400).json('Apellido inválido (mínimo 2 caracteres)')
    }

    if (typeof telefono !== 'number' || telefono.toString().length !== 10) {
      return res.status(400).json('Teléfono inválido (debe ser numérico de 10 dígitos)')
    }

    if (typeof cedula !== 'number' || cedula.toString().length < 5 || cedula.toString().length > 10) {
      return res.status(400).json('Cédula inválida (debe ser numérica entre 5 y 10 dígitos)')
    }

    const urlRegex = /^https?:\/\/[^\s]+$/
    if (typeof foto !== 'string' || !urlRegex.test(foto)) {
      return res.status(400).json('Foto inválida (debe ser una URL válida)')
    }

    if (typeof clave !== 'string' || clave.length < 6) {
      return res.status(400).json('Clave inválida (mínimo 6 caracteres)')
    }

    if (vacunas == null && (!Array.isArray(vacunas) || !vacunas.every(v => typeof v === 'object'))) {
      return res.status(400).json('Vacunas inválidas')
    }

    // Verificar duplicidad de cédula
    const existente = await colPacientes.findOne({ cedula }) as Paciente | null
    if (existente != null) {
      return res.status(400).json('La cédula ya está registrada')
    }

    // Crear paciente
    const nuevoPaciente = {
      _id: new ObjectId(),
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      foto,
      cedula,
      telefono,
      clave,
      vacunas: vacunas ?? [] // si no mandan vacunas, queda vacío
    }

    await colPacientes.insertOne(nuevoPaciente)
    return res.status(201).json('Paciente creado correctamente')
  } catch (error) {
    console.error('Error al crear paciente:', error)
    return res.status(500).json('Error interno del servidor')
  }
})

paciente.put('/:id', async (req, res) => {
  // encierra las validacion en un try catch
  try {
    const { id: _id } = req.params
    if (!ObjectId.isValid(_id)) {
      return res.status(400).json('ID de paciente inválido')
    }

    // verificar si el cuerpo es un objeto
    if (typeof req.body !== 'object' || req.body === null) {
      return res.status(400).json('Cuerpo de la petición inválido')
    }

    const { telefono, cedula } = req.body
    let { nombre, apellido, foto, clave, claveNueva, claveActual } = req.body

    // se sanitizan
    nombre = nombre.trim()
    apellido = apellido.trim()
    foto = foto.trim()
    clave = clave.trim()
    claveNueva = claveNueva.trim()
    claveActual = claveActual.trim()

    // verificar si los string tienen una logitud mayor a 0
    if (nombre.length === 0 || apellido.length === 0 || foto.length === 0 || clave.length === 0 || claveNueva.length === 0 || claveActual.length === 0) {
      return res.status(400).json({ error: 'El cuerpo de la solicitud es inválido' })
    }

    // sanitizar los string
    nombre = nombre.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    apellido = apellido.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    foto = foto.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    clave = clave.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    claveNueva = claveNueva.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    claveActual = claveActual.replace(/</g, '&lt;').replace(/>/g, '&gt;')

    // verificar si las anteriores propiedades existen (son diferentes a null)
    if (nombre == null || apellido == null || foto == null || clave == null || claveNueva == null || claveActual == null) {
      return res.status(400).json({ error: 'El cuerpo de la solicitud es inválido' })
    }

    // verificar si las anteriores propiedades son del tipo correcto
    if (typeof nombre !== 'string' || typeof apellido !== 'string' || typeof foto !== 'string' || typeof clave !== 'string' || typeof claveNueva !== 'string' || typeof claveActual !== 'string') {
      return res.status(400).json({ error: 'El cuerpo de la solicitud es inválido' })
    }

    // para nombre, apellido solo se permite letras y espacios
    const soloLetrasYEspacios = /^[A-Za-z\s]+$/
    if (!soloLetrasYEspacios.test(nombre) || !soloLetrasYEspacios.test(apellido)) {
      return res.status(400).json({ error: 'Nombre y apellido solo pueden contener letras y espacios' })
    }

    // verificar si la foto es una URL valida
    if (!/^https?:\/\/[^\s]+(\.(jpg|jpeg|png|gif))$/.test(foto)) {
      return res.status(400).json({ error: 'Foto inválida (debe ser una URL válida)' })
    }

    // verificar si la clave tiene al menos 6 caracteres
    if (claveActual.length < 6 || claveNueva.length < 6) {
      return res.status(400).json({ error: 'Clave inválida (mínimo 6 caracteres)' })
    }

    // que si los strings no puedan tener 2 espacios seguidos, excepto en la clave
    // borra el espacio adicional, no lanza error
    nombre = nombre.replace(/\s{2,}/g, ' ')
    apellido = apellido.replace(/\s{2,}/g, ' ')
    foto = foto.replace(/\s{2,}/g, ' ')
    // clave = clave.replace(/\s{2,}/g, ' ')
    // claveNueva = claveNueva.replace(/\s{2,}/g, ' ')
    // claveActual = claveActual.replace(/\s{2,}/g, ' ')

    // telefono debe ser mayor a 0, y tener una logitud exacta de 10
    if (telefono <= 0 || telefono.toString().length !== 10) {
      return res.status(400).json({ error: 'Teléfono inválido (debe ser mayor a 0 y tener 10 dígitos)' })
    }

    // la cedula debe ser mayor a 0 y tener una longitud entre 5 y 10
    if (cedula <= 0 || cedula.toString().length < 5 || cedula.toString().length > 10) {
      return res.status(400).json({ error: 'Cédula inválida (debe ser mayor a 0 y tener entre 5 y 10 dígitos)' })
    }

    // Verificar duplicidad de cédula
    const existente = await colPacientes.findOne({ cedula, _id: { $ne: new ObjectId(_id) } }) as Paciente | null // $ne es para que no tome en cuenta el mismo paciente y $ne significa "no igual" que es un comando de MongoDB
    if (existente != null) {
      return res.status(400).json({ error: 'La cédula ya está registrada' })
    }
    // Verificar si el paciente existe
    const paciente = await colPacientes.findOne({ _id: new ObjectId(_id) }) as Paciente | null
    if (paciente == null) {
      return res.status(404).json('Paciente no encontrado')
    }

    // verificar si la clave anterior es la misma que la que esta en la base de datos
    const usuarioExistente = await colPacientes.findOne({ _id: new ObjectId(_id) }) as Paciente | null
    if (usuarioExistente == null || usuarioExistente.clave !== claveActual) {
      return res.status(404).json('Usuario no encontrado')
    }

    // Actualizar paciente
    const pacienteActualizado: Omit<Paciente, '_id' | 'vacunas'> = { // esto aqui es porque Omit<Paciente, '_id'> | 'vacunas' es para que no se incluya el _id en la actualización
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      foto,
      cedula,
      telefono,
      clave: claveNueva
    }

    await colPacientes.updateOne({ _id: new ObjectId(_id) }, { $set: pacienteActualizado })
    return res.status(200).json('Paciente actualizado correctamente')
  } catch (error) {
    console.error('Error al actualizar paciente:', error)
    return res.status(500).json('Error interno del servidor')
  }
})

paciente.delete('/:id', async (req, res) => {
  try {
    const { id: _id } = req.params
    if (!ObjectId.isValid(_id)) {
      return res.status(400).json('ID de paciente inválido')
    }

    // Verificar si el paciente existe
    const paciente = await colPacientes.findOne({ _id: new ObjectId(_id) }) as Paciente | null
    if (paciente == null) {
      return res.status(404).json('Paciente no encontrado')
    }

    const resultado = await colPacientes.deleteOne({ _id: new ObjectId(_id) })

    if (resultado.deletedCount === 0) {
      return res.status(404).json('Paciente no encontrado')
    }

    return res.status(200).json('Paciente eliminado correctamente')
  } catch (error) {
    console.error('Error al eliminar paciente:', error)
    return res.status(500).json('Error interno del servidor')
  }
})

// se utilizara patch para las vacunas
paciente.patch('')

export default paciente
