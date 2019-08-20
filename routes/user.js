const router = require('express').Router();
const controller = require('../controllers/user');
const validations = require('../validations');

module.exports = ({
  db,
  redis,
  passport
} = handles) => {
  //signup
  router.post('/signup', validations.signup, controller.signup(db));

  //signin
  router.post(
    '/signin',
    validations.signin,
    passport.authenticate('local', {
      session: false
    }),
    controller.signin()
  );

  //signout
  router.post(
    '/signout',
    passport.authenticate('token', {
      session: false
    }),
    controller.signout(redis)
  );

  //change password
  router.post(
    '/change-password',
    validations.changepassword,
    passport.authenticate('token', {
      session: false
    }),
    controller.changePassword(db, redis)
  );

  //remove user
  router.delete(
    '/',
    passport.authenticate('token', {
      session: false
    }),
    controller.deleteUser(db, redis)
  );
  return router;
};