import { Router } from 'express'

const logout = Router()

logout.post('/', (req, res) => {
  res.clearCookie('session')
  res.json({ message: 'Sesión cerrada correctamente' })
})

export default logout
