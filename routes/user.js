const router = require('express').Router()
const controller = require('../controllers/user')
const validations = require('../validations')
const passport = require('passport')

module.exports = () => {
  //signup
  router.post('/signup', validations.signup, controller.signup());

  //signin
  router.post(
    '/signin',
    validations.signin,
    passport.authenticate('local', {
      session: false
    }),
    controller.signin
  );

  //signout
  router.post(
    '/signout',
    passport.authenticate('token', {
      session: false
    }),
    controller.signout
  );

  //change password
  router.post(
    '/change-password',
    validations.changepassword,
    passport.authenticate('token', {
      session: false
    }),
    controller.changePassword
  );

  //remove user
  router.delete(
    '/',
    passport.authenticate('token', {
      session: false
    }),
    controller.deleteUser
  );
  return router;
}