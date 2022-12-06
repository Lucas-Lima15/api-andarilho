const mongoose = require('mongoose')

const serviceSchema = mongoose.Schema({
  nome: {
    type: String,
    default: null
  },
  cnpj: {
    type: String,
    default: null
  },
  tipoServico: {
    type: String,
    default: null
  },
  categoria: {
    type: String,
    default: null
  },
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  }
}, { timestamps: true })

const Service = mongoose.model('Service', serviceSchema)

module.exports = Service
