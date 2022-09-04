const jwt = require('jsonwebtoken')
const UserService = require('../services/user-service')

class AuthMiddleware {
  /**
    * Verifica se o é token válido, protegendo a rota
    *
    * @param {object} req
    * @param {object} res
    * @param {Function} next
    */
  static async verifyJwt (req, res, next) {
    const token = req.headers['x-access-token'] || req.body.token

    let id
    let error
    try {
      if (!token) {
        error = new Error('Nenhum token encontrado.')
        error.status = 401
        throw error
      }

      await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err?.name === 'TokenExpiredError') {
          error = new Error('Token expirado')
          error.status = 403
        }

        if (err) throw err

        id = decoded._id
      })

      if (id) req.user = await UserService.findById(id)
      else throw new Error()

      next()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = AuthMiddleware
