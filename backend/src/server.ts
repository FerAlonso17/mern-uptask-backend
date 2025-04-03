import { configDotenv } from 'dotenv'
import express from 'express'
import { connectDB } from './config/db'
import projectRoutes from './routes/projectRoutes'
import authRoutes from './routes/authRoutes'
import cors from 'cors'
import { corsConfig } from './config/cors'
import morgan from 'morgan'

//para usar variables de entorno
configDotenv()

connectDB()

const app = express()
app.use(cors(corsConfig))

//Logging
app.use(morgan('dev'))

//Leer datos de formularios
app.use(express.json())

app.use('/api/auth',authRoutes)
app.use('/api/projects', projectRoutes)
export default app