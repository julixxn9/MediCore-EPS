import { Router } from 'express'
import { authVerify } from '../middleware/authVerify'
import { getAllUsers, getUserMe, deleteUser, getUserByIdorCedula, modifyFulluser, postUser } from '../controllers/user.controller'

const paciente = Router()

// Obtener todos los pacientes
paciente.get('/', authVerify(true), getAllUsers)

// Obtener un paciente por ID o cédula
paciente.get('/me', authVerify(true), getUserMe)

paciente.get('/:id', authVerify(true), getUserByIdorCedula)
// Crear paciente
paciente.post('/', authVerify(false), postUser)

// Actualizar paciente
paciente.put('/:id', authVerify(true), modifyFulluser)

// Eliminar paciente
paciente.delete('/:id', authVerify(true), deleteUser)

export default paciente
