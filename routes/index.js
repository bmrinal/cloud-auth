const router = require('express').Router();

//application routes
const user = require('./user');
const subuser = require('./subuser');
const token = require('./token');

module.exports = handles => {
  router.use('/user', user(handles));
  router.use('/user/sub', subuser(handles));
  router.use('/token', token(handles));
  return router;
};
