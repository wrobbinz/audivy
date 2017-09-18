import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import session from 'cookie-session'
import {} from 'dotenv/config'
import authMiddleware from './middleware/auth'
import authRoutes from './routes/auth'
import userRoutes from './routes/user'


const app = express()
app.use(morgan('dev'))
app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.json())
app.use(session({ secret: process.env.SECRET_KEY }))

// Routes
app.use('/api/v1/user', authMiddleware.loginRequired, userRoutes)
app.use('/api/v1/auth', authRoutes)

app.get('/', (req, res) => {
  res.send('his')
})

app.listen(6060, () => {
  console.log('port: 6060') // eslint-disable-line no-console
})

export default app
