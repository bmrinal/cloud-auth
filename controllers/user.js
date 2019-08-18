const respond = require('../utils/respond'); //responder (formats and sends the appropriate response codes and responses to the client)
const adapter = require('../adapter'); //data adapter
const dbops = require('../dbops'); //database operations
const getToken = require('../utils/token-generator'); //JWT token generator

const {
  check,
  validationResult
} = require('express-validator');

module.exports = {
  signup: db => async (req, res) => {
    const dbresults = await dbops.insertUser(db, adapter.getUsers(req.body));
    respond.dbops(res, dbresults);
  },
  signin: () => (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }
    respond.success(res, {
      token: getToken(req.user)
    });
  },
  signout: redis => (req, res) => {
    redis.del(req.user.token, (err, reply) => {
      if (!err) {
        respond.success(res, 'User signed out successfully');
      } else {
        respond.internalError(res);
      }
    });
  },
  changePassword: (db, redis) => async (req, res) => {
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
};