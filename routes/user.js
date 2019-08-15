const router = require('express').Router();
const respond = require('../utils/respond'); //responder (formats and sends the appropriate response codes and responses to the client)
const dbops = require('../dbops'); //database operations
const getToken = require('../utils/token-generator'); //JWT token generator
const controller = require('../controllers/user');
const validations = require('../validations');
const { check, validationResult } = require('express-validator');

module.exports = ({ db, redis, passport } = handles) => {
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
    (req, res, next) => {
      redis.del(req.user.token, (err, reply) => {
        if (!err) {
          respond.success(res, 'User signed out successfully');
        } else {
          respond.internalError(res);
        }
      });
    }
  );

  //change password
  router.post(
    '/change-password',
    [
      check('oldPassword')
        .trim()
        .not()
        .isEmpty(),
      check('newPassword')
        .trim()
        .not()
        .isEmpty()
    ],
    passport.authenticate('token', { session: false }),
    async (req, res, next) => {
      const changePassword = await dbops.changeUserPassword(
        db,
        req.user.email,
        req.body.oldPassword,
        req.body.newPassword
      );
      if (changePassword === 'success') {
        redis.del(req.user.token);
        respond.success(res, 'Password changed');
      } else {
        respond.dbops(res, changePassword);
      }
    }
  );

  //remove user
  router.delete(
    '/',
    passport.authenticate('token', { session: false }),
    async (req, res, next) => {
      let userid = req.user.id;
      const dbResults = await dbops.deleteUser(db, userid);
      if (dbResults.success) {
        await redis.del(req.user.token); //signing out the user
        respond.success(res, dbResults.data);
      } else {
        respond.dbops(res, dbResults);
      }
    }
  );

  //change password
  router.post(
    '/change-password',
    [
      check('oldPassword')
        .trim()
        .not()
        .isEmpty(),
      check('newPassword')
        .trim()
        .not()
        .isEmpty()
    ],
    passport.authenticate('token', { session: false }),
    async (req, res, next) => {
      const changePassword = await dbops.changeUserPassword(
        db,
        req.user.email,
        req.body.oldPassword,
        req.body.newPassword
      );
      if (changePassword === 'success') {
        redis.del(req.user.token);
        respond.success(res, 'Password changed');
      } else {
        respond.dbops(res, changePassword);
      }
    }
  );
  return router;
};
