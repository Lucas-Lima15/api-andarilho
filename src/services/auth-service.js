const jwt = require('jsonwebtoken')

class AuthService {
  /**
     * Gera um jwt
     *
     * @param {object} user usuário
     * @returns token
     */
  static async getToken (user) {
    const { _id } = user
    const token = await jwt.sign({ _id, date: new Date() }, process.env.JWT_SECRET, {
      expiresIn: '20m'
    })

    return token
  }
}

module.exports = AuthService
