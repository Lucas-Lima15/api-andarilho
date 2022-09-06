const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  nome: String,
  email: String,
  role: [],
  password: String
})

const User = mongoose.model('User', userSchema)

module.exports = User
