import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebnhooks } from './controllers/webhooks.js'

//initialize express
const app = express()

//connect to database
await connectDB()

//middlewares
app.use(cors())

//regular routes
app.get('/', (req, res) => res.send("API working"))

// Clerk webhook route (must use express.raw)
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebnhooks)

//port
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
