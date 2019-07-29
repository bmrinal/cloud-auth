const crypto = require('crypto');
const redis = require('redis');
const logger = require('./logger');

module.exports = user => {
  const token = crypto.randomBytes(256).toString('hex');
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };
  const redisClient = redis.createClient('redis://redis:6379');
  try {
    redisClient.set(token, JSON.stringify(payload), 'EX', '1800');
  } catch (err) {
    logger.db.error(`Unable to set up redis client - ${err}`);
  }
  return token;
};
