const Joi = require('joi')
const { messages } = require('joi-translation-pt-br')
const User = require('../models/user')

class UserValidation {
  static async personalData (user) {
    const schema = await Joi.object({
      nome: Joi.string().required(),
      email: Joi.string().email().required(),
      role: Joi.array().empty().required(),
      password: Joi.string().min(4).max(15).required(),
      _id: Joi.string()
    })

    const result = await schema.validate(user, { abortEarly: false, messages })
    if (result.error) {
      const error = result.error
      error.status = 400
      throw error
    }
    return true
  }

  static async verifyEmail (email) {
    const verifyUser = await User.exists({ email })

    const schema = await Joi.string().email().custom((value, helpers) => {
      if (verifyUser) {
        return helpers.message('Já existe usuário com este email.')
      }

      return value
    })

    const result = await schema.validate(email, { abortEarly: false, messages })
    if (result.error) {
      const error = result.error
      error.status = 400
      throw error
    }
    return true
  }
}

module.exports = UserValidation
