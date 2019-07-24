const logger = require("../utils/logger");
const respond = require("../utils/respond");

module.exports = (error, req, res, next) => {
  if (error instanceof SyntaxError) {
    logger.access.error(error);
    respond.invalidJSON(res);
  } else {
    next();
  }
};
