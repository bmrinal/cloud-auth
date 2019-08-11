const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

module.exports = db => {
  return new LocalStrategy(
    {
      usernameField: 'email'
    },
    (username, password, done) => {
      db.collection('users').findOne({ email: username }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, 'Incorrect username/password');
        }

        bcrypt.compare(password, user.password, (err, res) => {
          if (err) {
            return done(null, false, 'Incorrect username/password');
          } else {
            if (res) {
              return done(null, user);
            } else {
              return done(null, false, 'Incorrect username/password');
            }
          }
        });
      });
    }
  );
};
