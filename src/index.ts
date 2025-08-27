import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const PORT = (process.env.PORT != null) || 3000

app.get('/EPS', (_, res) => {
  res.send('holaa cara de perro')
})

app.listen(PORT, () => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  console.log(`servidor corriendo en el puerto http://localhost:${PORT}`)
})
