const router = require('express-promise-router')()
const controller = require('../controllers/user')
const validations = require('../validations')
const passport = require('passport')
const authenticateToken = require('../middlewares/authenticateToken')

router.post('/signup', controller.signup)
router.post('/login', controller.login)
router.delete('/', authenticateToken, controller.delete)


// router.post(
//   '/signin',
//   validations.signin,
//   passport.authenticate('local', {
//     session: false
//   }),
//   controller.signin
// )

module.exports = router

  // //signin
  // router.post(
  //   '/signin',
  //   validations.signin,
  //   passport.authenticate('local', {
  //     session: false
  //   }),
  //   controller.signin
  // );

  // //signout
  // router.post(
  //   '/signout',
  //   passport.authenticate('token', {
  //     session: false
  //   }),
  //   controller.signout
  // );

  // //change password
  // router.post(
  //   '/change-password',
  //   validations.changepassword,
  //   passport.authenticate('token', {
  //     session: false
  //   }),
  //   controller.changePassword
  // );

  // //remove user
  // router.delete(
  //   '/',
  //   passport.authenticate('token', {
  //     session: false
  //   }),
  //   controller.deleteUser
  // );