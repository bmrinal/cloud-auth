const router = require('express').Router();
const respond = require('../utils/respond'); //responder (formats and sends the appropriate response codes and responses to the client)
const adapter = require('../adapter'); //data adapter
const dbops = require('../dbops'); //database operations
const getToken = require('../utils/token-generator'); //JWT token generator

const { check, validationResult } = require('express-validator');

module.exports = (db, redis, passport) => {
  //signup
  router.post(
    '/signup',
    [
      check('email')
        .trim()
        .isEmail()
        .normalizeEmail(),
      check('password')
        .trim()
        .isEmpty()
    ],
    async (req, res, next) => {
      const dbresults = await dbops.insertUser(db, adapter.getUsers(req.body));
      respond.dbops(res, dbresults);
    }
  );

  //signin
  router.post(
    '/signin',
    [
      check('email')
        .isEmail()
        .normalizeEmail(),
      check('password')
        .not()
        .isEmpty()
    ],
    passport.authenticate('local', {
      session: false
    }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.array()
        });
      }

      respond.success(res, {
        token: getToken(req.user)
      });
    }
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
