class TokenExpiredError extends Error {
  constructor (message) {
    super(message)
    this.nome = 'TokenExpiredError'
    this.code = 403
  }
}

module.exports = TokenExpiredError
