const request = require('supertest')
const App = require('../../app')
const MongoDB = require('../../database/mongodb')
const bcrypt = require('bcrypt')

const app = new App()
const server = app.express

const User = require('../../models/user')

const userMock = require('../mock/userMock')

describe('UserHandler', () => {
  beforeAll(async () => {
    MongoDB.connectTest()
  })

  afterAll(async () => {
    MongoDB.closeConnectionDropDatabase()
  })

  beforeEach(async () => {
    await User.deleteMany({})
  })

  describe('/user/signup POST', () => {
    it('should signup and return a user', async () => {
      const data = {
        nome: 'Lucas',
        email: 'lucas@test.com',
        senha: '1234',
        role: ['user']
      }

      const { body } = await request(server)
        .post('/user/signup')
        .send(data)

      const verifyPassword = await bcrypt.compare(data.senha, body.data.user.senha)

      expect(body).toBe({})
      expect(body.data.user.nome).toBe(data.nome)
      expect(body.data.user.email).toBe(data.email)
      expect(body.data.user.role).toEqual(data.role)
      expect(verifyPassword).toBe(true)
    })

    it('shouldnt be able to signup a user and return a error if email already exists', async () => {
      await User.insertMany(userMock)

      const data = {
        nome: userMock.nome,
        email: userMock.email,
        senha: '1234',
        role: ['user']
      }

      const { body } = await request(server)
        .post('/user/signup')
        .send(data)
        .expect(400)

      expect(body.errors.detail).toBe('Já existe usuário com este email.')
    })
  })
})
