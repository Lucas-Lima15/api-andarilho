const Service = require('../models/service')

class ServiceService {
  static async create (service) {
    const serviceCreated = await Service.create(service)

    return serviceCreated
  }

  static async getServices () {
    const services = await Service.find({})

    return services
  }
}

module.exports = ServiceService
