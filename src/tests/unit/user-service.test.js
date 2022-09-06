const MongoDB = require('../../database/mongodb')
const bcrypt = require('bcrypt')

const User = require('../../models/user')
const UserService = require('../../services/user-service')

const userMock = require('../mock/userMock')

describe('UserService', () => {
  beforeAll(async () => {
    await MongoDB.connectTest()
  })

  afterAll(async () => {
    await MongoDB.closeConnectionDropDatabase()
  })

  beforeEach(async () => {
    await User.deleteMany({})
  })

  describe('create', () => {
    it('should be able to create a user', async () => {
      const user = { ...userMock, password: '1234', _id: null }
      const userCreated = await UserService.create(user)

      const isCorrectPassword = await bcrypt.compare('1234', userCreated.password)

      expect(userCreated.nome).toEqual(userMock.nome)
      expect(userCreated.email).toEqual(userMock.email)
      expect(userCreated.role).toEqual(userMock.role)
      expect(isCorrectPassword).toBe(true)
    })
  })

  describe('login', () => {
    it('should be able to login user and return a user', async () => {
      await User.insertMany(userMock)

      const user = await UserService.login(userMock.email, '1234')

      expect(user).toBeTruthy()
      expect(user.nome).toEqual(userMock.nome)
    })

    it('shouldnt be able to login a user given a wrong password and throw a error', async () => {
      await User.insertMany(userMock)

      await expect(async () => {
        await UserService.login(userMock.email, '12345')
      }).rejects.toThrowError('Senha errada.')
    })
  })
})
