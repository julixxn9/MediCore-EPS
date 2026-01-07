import { Router } from 'express'
import dotenv from 'dotenv'
import { login, refresh } from '../controllers/auth.controller'

const authRoute = Router()
dotenv.config()

authRoute.post('/login', login)
authRoute.post('/refresh', refresh)

export default authRoute
