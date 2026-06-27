import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import express from 'express'
import menuHandler from './api/menu.js'
import reservasHandler from './api/reservas.js'

const app = express()
app.use(express.json())

app.all('/api/menu', menuHandler)
app.all('/api/reservas', reservasHandler)
app.all('/api/reservas/:id', reservasHandler)

app.listen(3001, () => console.log('API server running on http://localhost:3001'))
