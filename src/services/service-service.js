const Service = require('../models/service')

class ServiceService {
  static async create (service) {
    const serviceCreated = await Service.create(service)

    return serviceCreated
  }

  static async getServices () {
    const services = await Service.find({}).populate('user')

    return services
  }

  static async update (idUser, service) {
    const serviceUpdate = await Service.find({ idUser })
    serviceUpdate.nome = service.nome || serviceUpdate.nome
    serviceUpdate.cnpj = service.cnpj || serviceUpdate.cnpj
    serviceUpdate.tipoServico = service.tipoServico || serviceUpdate.tipoServico
    serviceUpdate.categoria = service.categoria || serviceUpdate.categoria

    serviceUpdate.save()

    return serviceUpdate
  }
}

module.exports = ServiceService
