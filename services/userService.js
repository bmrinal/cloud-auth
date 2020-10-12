const logger = require('../utils/logger')
const bcrypt = require('bcryptjs')
const { mongoDb: db } = require('../db')
const { Duplicate, InternalError } = require('../errors')
class UserService {
    async checkIfUserExists(user) {
        //check duplicates
        const existingEmails = await db
            .collection('users')
            .find({ email: user.email })

        const existingUsernames = await db
            .collection('users')
            .find({ username: user.username })

        if (existingEmails || (user.username && existingUsernames)) {
            logger.db.error(`User already exists -  ${user.email}`)
            throw new Duplicate(`User already exists -  ${user.email}`)
        }
        return true
    }

    async insertUser(user) {
        await this.checkIfUserExists(user)
        try {
            let hash = await bcrypt.hash(user.password, 10)
            user.password = hash
            await db.collection('users').insertOne(user)
            logger.db.info(`User successfully Provisioned -  ${user.email}`)
            return user.data
        } catch (err) {
            logger.db.error(err)
            throw new InternalError(err.message)
        }
    }

    async removeUser(email) {
        try {
            const test = await db.collection('users').deleteOne({ email })
        } catch (err) {
            logger.db.error(err)
            throw new InternalError(err.message)
        }
    }

}

module.exports = new UserService()

// module.exports = {
//   changeUserPassword: async (db, email, oldPassword, newPassword) => {
//     if (!email || !oldPassword || !newPassword) {
//       return 'invalid'
//     }
//     const user = await db.collection('users').findOne({ email: email })
//     if (user) {
//       let isOldPasswordCorrect = await bcrypt.compare(
//         oldPassword,
//         user.password
//       )
//       if (isOldPasswordCorrect) {
//         try {
//           let hash = await bcrypt.hash(newPassword, 10)
//           if (hash) {
//             await db.collection('users').findOneAndUpdate(
//               { email: email },
//               {
//                 $set: { password: hash }
//               }
//             )
//             logger.db.info(`Password updated successfully - ${email}`)
//             return 'success'
//           } else {
//             logger.db.error(`Unable to hash the password ${err}`)
//             return 'internal error'
//           }
//         } catch (err) {
//           logger.db.error(err)
//           return 'internal error'
//         }
//       } else {
//         return 'invalid'
//       }
//     } else {
//       return 'invalid'
//     }
//   },
//   getUser: async (db, email) => {
//     if (!email) {
//       return 'invalid'
//     }
//     try {
//       const user = await db.collection('users').findOne({ email: email })
//       if (user) {
//         return { success: true, data: user }
//       } else {
//         return 'invalid'
//       }
//     } catch (err) {
//       logger.db.error(err)
//       return 'internal error'
//     }
//   },
//   deleteSubUsers: async (db, users, currentUser) => {
//     if (!users || !Array.isArray(users) || !(users && users.length)) {
//       return 'invalid'
//     }
//     try {
//       const removedUsers = await db.collection('users').remove({
//         parent: currentUser.id,
//         _id: { $in: users.map(user => mongo.ObjectID(user)) }
//       })
//       return {
//         success: true,
//         data: `${removedUsers.result.n} user/users removed`
//       }
//     } catch (err) {
//       logger.db.error(err)
//       return 'internal error'
//     }
//   },
//   deleteUser: async (db, userid) => {
//     if (!userid) {
//       return 'invalid'
//     }
//     try {
//       const user = await db
//         .collection('users')
//         .remove({ _id: mongo.ObjectID(userid) })
//       return {
//         success: true,
//         data: `User removed`
//       }
//     } catch (err) {
//       logger.db.error(err)
//       return 'internal error'
//     }
//   },
//   getSubUsers: async (db, parentUser) => {
//     if (!parentUser) {
//       return 'invalid'
//     }
//     try {
//       const users = await db
//         .collection('users')
//         .find({ parent: parentUser }, { projection: { password: 0, _id: 0 } })
//         .toArray()
//       if (users) {
//         return { success: true, data: users }
//       } else {
//         return 'invalid'
//       }
//     } catch (err) {
//       logger.db.error(err)
//       return 'internal error'
//     }
//   }
// }

