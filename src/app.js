require('dotenv').config()

const express = require('express')
const cors = require('cors')

const MongoDB = require('./database/mongodb')
const userRoutes = require('./handlers/user-handler')

class App {
  constructor () {
    this.express = express()
    this.middlewares()
    this.routes()
    this.errorHandling()
  }

  listen () {
    this.express.listen(process.env.PORT || 3000, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT} ${new Date()}`)
    })
  }

  database () {
    MongoDB.connect()
  }

  middlewares () {
    this.express.use(express.json())
    this.express.use(cors())
  }

  routes () {
    this.express.use(userRoutes)
  }

  errorHandling () {
    this.express.use((error, req, res, next) => {
      const status = error.status || 500
      const message = error.message || 'Internal Server Error'
      res.status(status).json({
        errors: {
          detail: message,
          status
        }
      })
    })
  }
}

module.exports = App
