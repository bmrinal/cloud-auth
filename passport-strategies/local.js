const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { mongoDb: db } = require('../db')


module.exports = () => {
  return new LocalStrategy(
    {
      usernameField: 'email'
    },
    async (username, password, done) => {
      const user = await db.collection('users').findOne({ email: username })
      if (!user) {
        return done(null, false, { message: 'Incorrect username/password' })
      }
      const passwordsMatch = await bcrypt.compare(password, user.password)
      if (!passwordsMatch) {
        return done(null, false, { message: 'Incorrect username/password' })
      }
      return done(null, user)
    }
  )
}
