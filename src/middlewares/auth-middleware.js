const jwt = require('jsonwebtoken')
const TokenExpiredError = require('../errors/token-expired-error')
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
        if (err?.name === 'TokenExpiredError') throw new TokenExpiredError('Token expirado')

        if (err) throw err

        id = decoded._id
      })

      req.user = await UserService.findById(id)

      next()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = AuthMiddleware
