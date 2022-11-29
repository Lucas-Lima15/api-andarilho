const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  email: {
    type: String,
    default: null
  },
  senha: {
    type: String,
    default: null
  },
  role: {
    type: String,
    default: null
  },
  nome: {
    type: String,
    default: null
  },
  sexo: {
    type: String,
    default: null
  },
  dataNascimento: {
    type: String,
    default: null
  },
  cpf: {
    type: String,
    default: null
  }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User
