const router = require('express-promise-router')()

//application routes
const user = require('./user')
const subUser = require('./subUser')
const token = require('./token')

router.use('/user', user)
router.use('/user/sub', subUser)
router.use('/token', token)
module.exports = router

