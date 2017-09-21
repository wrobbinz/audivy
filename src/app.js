import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import session from 'cookie-session'
import helmet from 'helmet'
import {} from 'dotenv/config'
import authMiddleware from './middleware/auth'
import authRoutes from './routes/auth'
import userRoutes from './routes/user'


const app = express()
app.use(helmet())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(session({ secret: process.env.SECRET_KEY }))

// Routes
app.get('/', (req, res) => {
  res.send('hi!')
})
app.use('/api/v1/user', authMiddleware.loginRequired, userRoutes)
app.use('/api/v1/auth', authRoutes)
// 404
app.use((req, res, next) => {
  const err = new Error('Not Found (404)')
  err.status = 404
  next(err)
})

// Error Handler: Development
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err,
    })
  })
}
// Error Handler: Production
app.use((err, req, res) => {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {},
  })
})

app.listen(6060, () => {
  console.log('port: 6060') // eslint-disable-line no-console
})

export default app
