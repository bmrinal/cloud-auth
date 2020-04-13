const logger = require('./utils/logger');
const mongo = require('mongodb');
const bcrypt = require('bcryptjs');
const { mongoDb: db } = require('./db')


module.exports = {
  insertUser: async (user) => {

    //validations TODO: SANITIZE INPUTS
    if (user.email === '' || user.password === '') {
      logger.db.error('Invalid/Blank email and/or password supplied');
      return 'invalid';
    }
    //check duplicates
    const existingEmails = await db
      .collection('users')
      .find({ email: user.email })
      .count();
    const existingUsernames = await db
      .collection('users')
      .find({ username: user.username })
      .count();

    if (existingEmails || (user.username !== '' && existingUsernames)) {
      logger.db.error(`User already exists -  ${user.email}`);
      return 'duplicate';
    } else {
      try {
        let hash = await bcrypt.hash(user.password, 10);
        if (hash) {
          user.password = hash;
          const dbResponse = await db.collection('users').insertOne(user);
          logger.db.info(`User successfully Provisioned -  ${user.email}`);
          return 'success';
        }
      } catch (err) {
        logger.db.error(err);
        return 'internal error';
      }
    }
  },
  changeUserPassword: async (db, email, oldPassword, newPassword) => {
    if (!email || !oldPassword || !newPassword) {
      return 'invalid';
    }
    const user = await db.collection('users').findOne({ email: email });
    if (user) {
      let isOldPasswordCorrect = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (isOldPasswordCorrect) {
        try {
          let hash = await bcrypt.hash(newPassword, 10);
          if (hash) {
            await db.collection('users').findOneAndUpdate(
              { email: email },
              {
                $set: { password: hash }
              }
            );
            logger.db.info(`Password updated successfully - ${email}`);
            return 'success';
          } else {
            logger.db.error(`Unable to hash the password ${err}`);
            return 'internal error';
          }
        } catch (err) {
          logger.db.error(err);
          return 'internal error';
        }
      } else {
        return 'invalid';
      }
    } else {
      return 'invalid';
    }
  },
  getUser: async (db, email) => {
    if (!email) {
      return 'invalid';
    }
    try {
      const user = await db.collection('users').findOne({ email: email });
      if (user) {
        return { success: true, data: user };
      } else {
        return 'invalid';
      }
    } catch (err) {
      logger.db.error(err);
      return 'internal error';
    }
  },
  deleteSubUsers: async (db, users, currentUser) => {
    if (!users || !Array.isArray(users) || !(users && users.length)) {
      return 'invalid';
    }
    try {
      const removedUsers = await db.collection('users').remove({
        parent: currentUser.id,
        _id: { $in: users.map(user => mongo.ObjectID(user)) }
      });
      return {
        success: true,
        data: `${removedUsers.result.n} user/users removed`
      };
    } catch (err) {
      logger.db.error(err);
      return 'internal error';
    }
  },
  deleteUser: async (db, userid) => {
    if (!userid) {
      return 'invalid';
    }
    try {
      const user = await db
        .collection('users')
        .remove({ _id: mongo.ObjectID(userid) });
      return {
        success: true,
        data: `User removed`
      };
    } catch (err) {
      logger.db.error(err);
      return 'internal error';
    }
  },
  getSubUsers: async (db, parentUser) => {
    if (!parentUser) {
      return 'invalid';
    }
    try {
      const users = await db
        .collection('users')
        .find({ parent: parentUser }, { projection: { password: 0, _id: 0 } })
        .toArray();
      if (users) {
        return { success: true, data: users };
      } else {
        return 'invalid';
      }
    } catch (err) {
      logger.db.error(err);
      return 'internal error';
    }
  }
};
