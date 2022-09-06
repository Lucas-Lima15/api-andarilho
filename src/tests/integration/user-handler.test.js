const request = require('supertest')
const App = require('../../app')
const MongoDB = require('../../database/mongodb')
const bcrypt = require('bcrypt')

const app = new App()
const server = app.express

const User = require('../../models/user')

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
        password: '1234',
        role: ['user']
      }

      const { body } = await request(server)
        .post('/user/signup')
        .send(data)
        .expect(200)

      const verifyPassword = await bcrypt.compare(data.password, body.data.user.password)

      expect(body.data.user.nome).toBe(data.nome)
      expect(body.data.user.email).toBe(data.email)
      expect(body.data.user.role).toEqual(data.role)
      expect(verifyPassword).toBe(true)
    })
  })
})
