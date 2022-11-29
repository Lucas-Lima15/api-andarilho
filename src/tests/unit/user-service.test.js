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
      const user = { ...userMock, senha: '1234', _id: null }
      const userCreated = await UserService.create(user)

      const isCorrectPassword = await bcrypt.compare('1234', userCreated.senha)

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

  describe('findById', () => {
    it('should be able to find and return a user', async () => {
      await User.insertMany(userMock)

      const user = await UserService.findById(userMock._id)

      expect(user.nome).toEqual(userMock.nome)
      expect(user.email).toEqual(userMock.email)
      expect(user.role).toEqual(userMock.role)
      expect(user.password).toEqual(userMock.password)
      expect(user._id).toBeTruthy()
    })

    it('shouldnt be able to find a user and throw a error', async () => {
      await expect(async () => {
        await UserService.findById(userMock._id)
      }).rejects.toThrowError(`Usuário com id ${userMock._id} não encontrado.`)
    })
  })

  describe('findByEmail', () => {
    it('should be able to find return a user', async () => {
      await User.insertMany(userMock)

      const user = await UserService.findByEmail(userMock.email)

      expect(user.nome).toEqual(userMock.nome)
      expect(user.email).toEqual(userMock.email)
      expect(user.role).toEqual(userMock.role)
      expect(user.password).toEqual(userMock.password)
      expect(user._id).toBeTruthy()
    })

    it('shouldnt be able to find a user an throw a error', async () => {
      await expect(async () => {
        await UserService.findByEmail(userMock.email)
      }).rejects.toThrowError(`Usuário com email ${userMock.email} não encontrado.`)
    })
  })
})
