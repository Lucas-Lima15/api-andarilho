const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  nome: String,
  email: String,
  role: [],
  password: String
})

module.exports = mongoose.model('User', userSchema)
