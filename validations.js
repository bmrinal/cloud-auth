const {
  check,
  validationResult
} = require('express-validator');

module.exports = {
  signup: [
    check('email')
    .trim()
    .isEmail()
    .normalizeEmail(),
    check('password')
    .trim()
    .isEmpty()
  ],
  signin: [
    check('email')
    .isEmail()
    .normalizeEmail(),
    check('password')
    .not()
    .isEmpty()
  ],
  changepassword: [
    check('oldPassword')
    .trim()
    .not()
    .isEmpty(),
    check('newPassword')
    .trim()
    .not()
    .isEmpty()
  ]
};