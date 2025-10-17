import cors from 'cors'
import dotenv from 'dotenv'
import express, { json } from 'express'
import { Collection, Db, MongoClient } from 'mongodb'
import morgan from 'morgan'
import login from './routes/login'
import paciente from './routes/users'
import vacunas from './routes/vacunas'
import { Paciente, Vacuna } from './types'

dotenv.config()

const uri = process.env.MONGO_URI as string
const cliente = new MongoClient(uri)
let db: Db
export let colPacientes: Collection <Paciente>
export let colVacunas: Collection <Vacuna>

const app = express()
app.use(cors())
app.use(json())
app.use('/EPS/pacientes', paciente)
app.use('/EPS/vacunas', vacunas)
app.use('/EPS/login', login)

app.use(morgan('dev'))

/* ejemplo de middleware y rutas
app.use(sapoHP)
app.get('/menu', (req, res) => {
  res.send('🍕 Menú: Pizza, Pasta, Ensalada')
})
app.get('/pedido', (req, res) => {
  res.status(201).send('Pedido creado ✅')
})
app.use(logRequestParts)
function sapoHP (req: Request, res: Response, next: NextFunction): void {
  console.log(`Alguien entró a la ruta ${req.path} con método ${req.method}`)
  console.log('Sapo HP')
  next()
}
function logRequestParts (req: Request, res: Response, next: NextFunction): void {
  const partes = req.path.split('/').filter(Boolean)

  partes.forEach((parte, index) => {
    const prefijo = '>'.repeat(index + 1)
    console.log(`${prefijo}${parte}`)
  })
  next()
}
// Rutas de ejemplo
app.get('/api/pokemons/pikachu/poder/attacktrueno', (req, res) => {
  res.json({ message: 'Pikachu uso un peo de trueno!' })
}) */

const PORT = Number(process.env.PORT ?? 3000)

app.get('/EPS', (_, res) => {
  res.send('holaa cara de perro')
})

async function conectar (): Promise<void> {
  try {
    await cliente.connect()
    console.log('Conectado a la base de datos')

    const database = process.env.MONGODB_DB as string
    db = cliente.db(database)

    const collectionPAC = process.env.MONGODB_COL_PAC as string
    colPacientes = db.collection(collectionPAC)

    const collectionVAC = process.env.MONGODB_COL_VAC as string
    colVacunas = db.collection(collectionVAC)
    app.listen(PORT, () => {
      console.log(`servidor corriendo en el puerto http://localhost:${PORT}/EPS`)
    })
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error)
    process.exit(1) // Salir del proceso con un código de error
  }
}

void conectar()
