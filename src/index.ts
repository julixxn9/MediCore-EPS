import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { Collection, Db, MongoClient } from 'mongodb'
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
app.use(express.json())
app.use('/api/pacientes', paciente)
app.use('/api/vacunas', vacunas)

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
