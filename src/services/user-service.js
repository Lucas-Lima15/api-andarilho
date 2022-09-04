const bcrypt = require('bcrypt')

const User = require('../models/user')

class UserService {
  /**
     * Cria um usuário na base de dados
     *
     * @param {Object} usuário
     * @returns usuário criado
     */
  static async create (user) {
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    const userCreated = await User.create(user)

    return userCreated
  }

  /**
     * Verifica se existe usuário com este email e valida a senha
     *
     * @param {string} email
     * @param {string} password
     * @returns usuário
     */
  static async login (email, password) {
    const user = await UserService.findByEmail(email)

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      const error = new Error('Senha errada.')
      error.status = 400
      throw error
    }

    return user
  }

  static async findById (id) {
    const user = await User.findById(id)

    if (!user) {
      const error = new Error(`Usuário com id ${id} não encontrado.`)
      error.status = 404
      throw error
    }

    return user
  }

  /**
     * Resgata um usuário
     *
     * @param {string} email
     * @returns usuário
     */
  static async findByEmail (email) {
    const user = await User.findOne({ email })

    if (!user) {
      const error = new Error(`Usuário com email ${email} não encontrado.`)
      error.status = 404
    }

    return user
  }
}

module.exports = UserService
