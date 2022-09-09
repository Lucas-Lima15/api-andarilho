const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  nome: String,
  email: String,
  role: [],
  password: String
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User
