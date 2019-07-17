const logger = require('../utils/logger');
module.exports = (error,req,res,next) => {
    if (error instanceof SyntaxError) {
        logger.access.error(error);
        respond.errors(res, "invalid json");
    } else {
        next();
    }
}