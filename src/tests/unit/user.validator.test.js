/* eslint-disable no-useless-escape */
const MongoDb = require('../../database/mongodb')
const User = require('../../models/user')
const UserValidation = require('../../validations/user-validation')
const userMock = require('../mock/userMock')

describe('UserValidator', () => {
  beforeAll(async () => {
    MongoDb.connectTest()
  })

  afterAll(async () => {
    MongoDb.closeConnectionDropDatabase()
  })

  beforeEach(async () => {
    await User.deleteMany({})
  })

  describe('personalData', () => {
    it('should throw a error if required fields are not filled', async () => {
      let result

      try {
        await UserValidation.personalData({})
      } catch (error) {
        result = error.message
      }

      expect(result).toBe('\"nome\" é obrigatório. \"email\" é obrigatório. \"role\" é obrigatório. \"password\" é obrigatório')
    })

    it('should throw error if values types are wrong', async () => {
      let result

      const user = {
        nome: 1234,
        email: 'Teste',
        role: 'Teste',
        password: 1234
      }

      try {
        await UserValidation.personalData(user)
      } catch (error) {
        result = error.message
      }

      expect(result).toBe('\"nome\" deve ser um texto. \"email\" deve ser um e-mail válido. \"role\" deve ser um array. \"password\" deve ser um texto')
    })

    it('should throw error if email is wrong', async () => {
      let result

      const user = {
        ...userMock,
        password: '1234',
        email: 'teste'
      }

      try {
        await UserValidation.personalData(user)
      } catch (error) {
        result = error.message
      }

      expect(result).toBe('\"email\" deve ser um e-mail válido')
    })
  })

  describe('verifyEmail', () => {
    it('should throw a error if user email already exists', async () => {
      let result

      await User.insertMany(userMock)
      try {
        await UserValidation.verifyEmail(userMock.email)
      } catch (error) {
        result = error.message
      }

      expect(result).toBe('Já existe usuário com este email.')
    })
  })
})
