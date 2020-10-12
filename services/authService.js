const logger = require('../utils/logger')
const bcrypt = require('bcryptjs')
const UserModel = require('../models/user')
const { mongoDb: db } = require('../db')
const tokenGenerator = require('../utils/token-generator');
const { required } = require('@hapi/joi');
const {Unauthorized} = require('../errors')
class AuthService {
  async login(loginDetails) {
    const { email, password } = loginDetails
    const user = await db.collection('users').findOne({ email })
    if (!user) {
      throw new Unauthorized('Invalid username/password')
    }
    const passwordsMatch = await bcrypt.compare(password, user.password)
    if (!passwordsMatch) {
      throw new Unauthorized('Invalid username/password')
    }
    const userToClient = new UserModel(user).data

    const token = tokenGenerator(userToClient)
    return { ...userToClient, token }
  }
}

module.exports = new AuthService()