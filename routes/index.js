const router = require('express').Router();

//application routes
const user = require('./user');
const subuser = require('./subuser');
const token = require('./token');

module.exports = (db, redis, passport) => {
  router.use('/user', user(db, redis, passport));
  router.use('/user/sub', subuser(db, redis, passport));
  router.use('/token', token(db, redis, passport));
  return router;
};
