const Joi = require('joi')
const { messages } = require('joi-translation-pt-br')

const ValidationError = require('../errors/validation-error')

const User = require('../models/user')

const options = {
  abortEarly: false, messages
}

class UserValidation {
  static async userData (user) {
    const schema = Joi.object({
      email: Joi.string().empty().email().required(),
      senha: Joi.string().empty().required(),
      role: Joi.string().empty().required(),
      nome: Joi.string().empty().required(),
      sexo: Joi.string().empty().required(),
      dataNascimento: Joi.string().empty().required(),
      cpf: Joi.string().empty().required()
    })

    const result = await schema.validate(user, options)

    if (result.error) throw new ValidationError(result.error.message)
  }

  static async email (email) {
    const result = await Joi.string().empty().email().required().validate(email, options)

    if (result.error) throw new ValidationError(result.error.message)
  }

  static async senha (senha) {
    const result = await Joi.string().empty().required().validate(senha, options)

    if (result.error) throw new ValidationError(result.error.message)
  }

  static async personalData (personalData) {
    const schema = await Joi.object({
      nome: Joi.string(),
      genero: Joi.string().valid('masculino', 'feminino'),
      dataNascimento: Joi.date(),
      cpf: Joi.string(),
      rg: Joi.string()
    })

    const result = await schema.validate(personalData, options)

    if (result.error) throw new ValidationError(result.error.message)
  }

  static async adress (adress) {
    const schema = await Joi.object({
      cep: Joi.string(),
      endereco: Joi.string(),
      complemento: Joi.string(),
      pontoReferencia: Joi.string()
    })

    const result = await schema.validate(adress, options)

    if (result.error) throw new ValidationError(result.error.message)
  }

  static async verifyEmail (email) {
    const verifyUser = await User.exists({ email })

    const schema = await Joi.string().email().custom((value, helpers) => {
      if (verifyUser) {
        return helpers.message('Já existe usuário com este email.')
      }

      return value
    })

    const result = await schema.validate(email, options)

    if (result.error) throw new ValidationError(result.error.message)
  }
}

module.exports = UserValidation
