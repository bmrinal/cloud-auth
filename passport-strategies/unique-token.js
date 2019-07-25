const TokenStrategy = require("passport-unique-token").Strategy;
const respond = require("../utils/respond");

module.exports = redis => {
  return new TokenStrategy((token, done) => {
    if (!token) {
      done(null, false);
    } else {
      redis.get(token, (err, reply) => {
        if (err || reply === null) {
          done(null, false);
        } else {
          console.log(reply);
          done(null, Object.assign({ token: token, ...JSON.parse(reply) }));
        }
      });
    }
  });
};
