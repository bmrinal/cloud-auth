const respond = require('../utils/respond'); //responder (formats and sends the appropriate response codes and responses to the client)
const adapter = require('../adapter'); //data adapter
const dbops = require('../dbops'); //database operations
const getToken = require('../utils/token-generator'); //JWT token generator

const { check, validationResult } = require('express-validator');

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
  }
};
