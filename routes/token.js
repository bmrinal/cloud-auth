const router = require('express').Router();
const respond = require('../utils/respond'); //responder (formats and sends the appropriate response codes and responses to the client)
const dbops = require('../dbops'); //database operations
const getToken = require('../utils/token-generator'); //JWT token generator

module.exports = ({ db, redis, passport } = handles) => {
  //verify token
  router.post(
    '/verify',
    passport.authenticate('token', {
      session: false
    }),
    (req, res) => {
      //refreshing the token
      redis.expire(req.user.token, 1800);
      respond.success(res, 'Token valid');
    }
  );

  // temporary token
  router.post('/temporary', async (req, res, next) => {
    const getUser = await dbops.getUser(db, req.body.email);
    if (getUser.success) {
      respond.success(res, {
        token: getToken({
          email: getUser.data.email
        })
      });
    } else {
      respond.dbops(res, getUser);
    }
  });
  return router;
};
