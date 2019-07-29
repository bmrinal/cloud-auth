const uid = require('gen-uid');
const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  const cleanup = () => {
    res.removeListener('finish', logFn);
    res.removeListener('close', abortFn);
    res.removeListener('error', errorFn);
  };

  const logFn = () => {
    cleanup();
    logger.access.info(
      `[${req.requestId}] ${res.statusCode} ${res.statusMessage}; ${res.get(
        'Content-Length'
      ) || 0}b sent`
    );
  };
  const abortFn = () => {
    cleanup();
    logger.access.info(`[${req.requestId}] Request aborted by client`);
  };

  const errorFn = () => {
    cleanup();
    logger.access.info(`[${req.requestId}] Unhandled internal error`);
  };

  req.requestId = uid.token(); //attaching a unique token to each request

  //logging the incoming request
  logger.access.info(`[${req.requestId}] ${req.method} ${req.originalUrl}`);

  //logging the outgoing
  res.on('finish', logFn);
  res.on('close', abortFn);
  res.on('error', errorFn);
  next();
};
