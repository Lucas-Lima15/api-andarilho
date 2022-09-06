require('dotenv').config()

const mongoose = require('mongoose')

class MongoDB {
  static async connect () {
    return await mongoose.connect(process.env.MONGODB_prd)
  }

  static async connectTest () {
    return await mongoose.connect(process.env.MONGODB_test, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }

  static async closeConnectionDropDatabase () {
    await mongoose.connection.db.dropDatabase()
    await mongoose.disconnect()
  }
}

module.exports = MongoDB
