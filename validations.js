const { check, validationResult } = require('express-validator');

module.exports = {
  signup: [
    check('email')
      .trim()
      .isEmail()
      .normalizeEmail(),
    check('password')
      .trim()
      .isEmpty()
  ]
};
