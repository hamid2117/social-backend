const { AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('./../config')

module.exports = (context) => {
  const authHeader = context.req.headers.authorization
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1]
    if (token) {
      try {
        const checking = jwt.verify(token, SECRET_KEY)
        return checking
      } catch (error) {
        throw new AuthenticationError('Token expired and invalid ')
      }
    }
    throw new Error('Authetication Token must be in  Bearer format')
  }
  throw new Error('Please provide authorization header')
}
