const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const filmsRouter = require('./routes/films')
const usersRouter = require('./routes/users')
const boolParser = require('express-query-boolean')
const rateLimit = require('express-rate-limit')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'
app.use(helmet())
app.use(logger(formatsLogger))
app.use(express.static('public'))
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 140,
  handler: (req, res, next) => {
    return res.status(429).json({
      status: 'error',
      code: 429,
      message: 'Too many requests',
    })
  },
})

app.use(limiter)
app.use(cors())
app.use(express.json())
app.use(boolParser())
app.use('/api/users', usersRouter)
app.use('/api/films', filmsRouter)

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({
    status: status === 500 ? 'fail' : 'error',
    code: status,
    message: err.message,
  })
})

module.exports = app
