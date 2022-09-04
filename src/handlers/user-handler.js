const express = require('express')

const AuthMiddleware = require('../middlewares/auth-middleware')

const AuthService = require('../services/auth-service')
const UserService = require('../services/user-service')

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
 * @param {string} nome nome do usuário
 * @param {string} email email do usuário
 * @param {string} password senha
 * @param {Array} role os papeis que o usuário tem
 */
router.post('/user/signup', async (req, res, next) => {
  const { nome, email, password, role } = req.body
  try {
    const user = await UserService.create({ nome, email, password, role })

    return res.json({
      user
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
 * @param {string} password senha do usuário
 */
router.post('/user/login', async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await UserService.login(email, password)
    const token = await AuthService.getToken(user)

    return res.json({
      user,
      token
    })
  } catch (error) {
    next(error)
  }
})

router.get('/user/test', AuthMiddleware.verifyJwt, async (req, res, next) => {
  try {
    const token = await AuthService.getToken(req.user)

    res.json({ message: 'Rota protegida acessada', token })
  } catch (err) {
    next(err)
  }
})

module.exports = router
