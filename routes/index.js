const router = require('express').Router()

//application routes
const user = require('./user')
const subUser = require('./subUser')
const token = require('./token')

module.exports = () => {
  router.use('/user', user())
  router.use('/user/sub', subUser)
  router.use('/token', token)
  return router
}
