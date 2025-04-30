import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebnhooks } from './controllers/webhooks.js'
import { buffer } from 'micro' // required to parse raw body for Clerk

const app = express()

// connect to MongoDB
await connectDB()

// middlewares
app.use(cors())

// raw body for webhooks
app.post(
  '/clerk',
  express.raw({ type: 'application/json' }), // <== IMPORTANT
  clerkWebnhooks
)

// default route
app.get('/', (req, res) => res.send('API working'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`)
})
