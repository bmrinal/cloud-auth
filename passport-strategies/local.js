const LocalStrategy = require("passport-local").Strategy;
module.exports = db => {
  return new LocalStrategy(
    {
      usernameField: "email"
    },
    (username, password, done) => {
      db.collection("users").findOne(
        { email: username, password: password },
        (err, user) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, "Incorrect username/password");
          }
          return done(null, user);
        }
      );
    }
  );
};
