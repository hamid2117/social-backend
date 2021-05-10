const User = require('./../../models/User')
const bycrpt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('./../../config')
const {
  validateRegisterInput,
  validateLoginInput,
} = require('./../../util/validators')
const { UserInputError } = require('apollo-server-errors')

const jwtGenrator = (user) => {
  // jwt will add data in JWT TOKEN
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  )
}

module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password)
      if (!valid) {
        throw new UserInputError('error', { errors })
      }
      const user = await User.findOne({ username })
      if (!user) {
        errors.general = 'user not registered yet'
        throw new UserInputError('user already error', {
          errors: { username: 'user not registered' },
        })
      }
      const pass = await bycrpt.compare(password, user.password) // second wala jo hash ho ka store h
      if (!pass) {
        errors.general = 'pasasword error'
        throw new UserInputError('errror in password', {
          errors: { password: ' password is invalid' },
        })
      }
      const token = jwtGenrator(user)
      return {
        ...user._doc, // all data
        id: user._id, //cuz it genrated not in docs
        token,
      }
    },
    //for Register

    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      //* validate user data

      const { errors, valid } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      )
      if (!valid) {
        throw new UserInputError('errors', { errors })
      }
      //TODO : Make sure user does not already exist
      const user = await User.findOne({ username }) //cuz findOne return null if nothing matches
      if (user) {
        throw new UserInputError('username is already taken ', {
          errors: { username: 'username is already taken' },
        })
      }
      //TODO : hash password and create an auth token
      password = await bycrpt.hash(password, 12)
      const newUser = new User({
        //User mongo schema & model(collection)
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
      })
      const res = await newUser.save()
      const token = jwtGenrator(res)
      return {
        ...res._doc, // all data
        id: res._id, //cuz it genrated not in docs
        token,
      }
    },
  },
}
