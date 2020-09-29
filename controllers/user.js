const UserModel = require('../models/user')
const userService = require('../services/userService'); //database operations
const getToken = require('../utils/token-generator'); //JWT token generator
const passport = require('passport')
const bcrypt = require('bcryptjs');
const { mongoDb: db } = require('../db')
const { Unauthorized, InternalError } = require('../errors')



class UserController {

  async signup(req, res) {
    const userModel = new UserModel(req.body)
    const user = await userService.insertUser(userModel)
    res.json(user)
  }

  async login(req, res) {
    const { email, password } = req.body
    const user = await db.collection('usersss').findOne({ email })
    console.dir(user)
    if (!user) {
      throw new Unauthorized('Invalid username/password')
    }
    const passwordsMatch = await bcrypt.compare(password, user.password)
    if (!passwordsMatch) {
      throw new Unauthorized('Invalid username/password')
    }
    const userToClient = new UserModel(user)
    res.json(userToClient.data)
  }
}
module.exports = new UserController()

// module.exports = {

//   signout: redis => (req, res) => {
//     redis.del(req.user.token, (err, reply) => {
//       if (!err) {
//         respond.success(res, 'User signed out successfully');
//       } else {
//         respond.internalError(res);
//       }
//     })
//   },
//   changePassword: (db, redis) => async (req, res) => {
//     const changePassword = await dbops.changeUserPassword(
//       db,
//       req.user.email,
//       req.body.oldPassword,
//       req.body.newPassword
//     );

//     if (changePassword === 'success') {
//       redis.del(req.user.token);
//       respond.success(res, 'Password changed');
//     } else {
//       respond.dbops(res, changePassword);
//     }
//   },
//   deleteUser: (db, redis) => async (req, res) => {
//     let userid = req.user.id;
//     const dbResults = await dbops.deleteUser(db, userid);
//     if (dbResults.success) {
//       await redis.del(req.user.token); //signing out the user
//       respond.success(res, dbResults.data);
//     } else {
//       respond.dbops(res, dbResults);
//     }
//   }
// }