const express = require('express')
const AuthMiddleware = require('../middlewares/auth-middleware')

const AuthService = require('../services/auth-service')
const UserService = require('../services/user-service')
const UserValidation = require('../validations/user-validation')

const router = express.Router()

/***
 * Cadastra usuário no banco de dados
 *
 * @path /user/signup
 * @method post
 * @produces apllication/json
 *
 * @required
 * @in body
 * @param {string} email email do usuário
 * @param {string} senha senha
 * @param {string} role os papeis que o usuário tem
 * @param {string} nome
 * @param {string} sexo
 * @param {string} dataNascimento
 * @param {string} cpf
 */
router.post('/user/signup', async (req, res, next) => {
  const {
    email,
    senha,
    role,
    nome,
    sexo,
    dataNascimento,
    cpf
  } = req.body || {}
  try {
    const user = {
      email,
      senha,
      role,
      nome,
      sexo,
      dataNascimento,
      cpf
    }

    await UserValidation.userData(user)
    await UserValidation.verifyEmail(email)

    const userCreated = await UserService.create(user)

    return res.json({
      data: {
        user: userCreated
      }
    })
  } catch (error) {
    next(error)
  }
})

/***
 * Faz login do usuário
 *
 * @path /user/login
 * @method post
 * @produces apllication/json
 *
 * @required
 * @in body
 * @param {string} email email do usuário
 * @param {string} senha senha do usuário
 */
router.post('/user/login', async (req, res, next) => {
  const { email, senha } = req.body

  await UserValidation.email(email)
  await UserValidation.senha(senha)

  try {
    const user = await UserService.login(email, senha)
    const token = await AuthService.getToken(user)

    return res.json({
      data: {
        user,
        token
      }
    })
  } catch (error) {
    next(error)
  }
})

router.get('/user/test', AuthMiddleware.verifyJwt, (req, res) => {
  return res.json({ teste: true })
})

module.exports = router
