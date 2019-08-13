const router = require('express').Router();
const respond = require('../utils/respond'); //responder (formats and sends the appropriate response codes and responses to the client)
const adapter = require('../adapter'); //data adapter
const dbops = require('../dbops'); //database operations
const getToken = require('../utils/token-generator'); //JWT token generator
const { check, validationResult } = require('express-validator');

module.exports = ({ db, redis, passport } = handles) => {
  // create sub user
  router.post(
    '/',
    passport.authenticate('token', {
      session: false
    }),
    async (req, res, next) => {
      const dbresults = await dbops.insertUser(
        db,
        Object.assign(
          {
            parent: req.user.id
          },
          adapter.getUsers(req.body)
        )
      );
      respond.dbops(res, dbresults);
    }
  );

  //remove sub users
  router.post(
    '/remove',
    passport.authenticate('token', {
      session: false
    }),
    async (req, res, next) => {
      let users = req.body.userid || req.body.userids;
      if (typeof users === 'string') {
        users = new Array(users);
      }
      const dbResults = await dbops.deleteSubUsers(db, users, req.user);
      if (dbResults.success) {
        respond.success(res, dbResults.data);
      } else {
        respond.dbops(res, dbResults);
      }
    }
  );

  // get sub users
  router.get(
    '/sub',
    passport.authenticate('token', {
      session: false
    }),
    async (req, res, next) => {
      const dbResults = await dbops.getSubUsers(db, req.user.id);
      if (dbResults.success) {
        respond.success(res, {
          users: dbResults.data
        });
      } else {
        respond.dbops(res, dbResults);
      }
    }
  );

  return router;
};
