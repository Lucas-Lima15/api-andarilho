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
})
