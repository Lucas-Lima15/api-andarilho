const bcrypt = require('bcrypt')

const NotFoundError = require('../errors/not-found-error')
const ValidationError = require('../errors/validation-error')

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
    user.senha = await bcrypt.hash(user.senha, salt)

    const userCreated = await User.create(user)

    return userCreated
  }

  /**
   * Verifica se existe usuário com este email e se a senha é válida
   *
   * @param {string} email
   * @param {string} senha
   * @returns usuário
   */
  static async login (email, senha) {
    const user = await UserService.findByEmail(email)

    const validPassword = await bcrypt.compare(senha, user.senha)

    if (!validPassword) throw new ValidationError('Senha errada.')

    return user
  }

  /**
   * resgata um usuário dado o id
   *
   * @param {string} id
   * @returns usuário
   */
  static async findById (id) {
    const user = await User.findById(id)

    if (!user) throw new NotFoundError(`Usuário com id ${id} não encontrado.`)

    return user
  }

  /**
   * Resgata um usuário dado email
   *
   * @param {string} email
   * @returns usuário
   */
  static async findByEmail (email) {
    const user = await User.findOne({ email })

    if (!user) throw new NotFoundError(`Usuário com email ${email} não encontrado.`)

    return user
  }
}

module.exports = UserService
