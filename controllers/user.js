const UserModel = require('../models/user')
const userService = require('../services/userService')
const authService = require('../services/authService')
const signinSchema = require('../schemas/signin')
const schemaValidator = require('../utils/schemaValidator')
class UserController {

  async signup(req, res) {
    const userModel = new UserModel(req.body)
    const user = await userService.insertUser(userModel)
    res.json(user)
  }

  async login(req, res) {
    const validatedLoginData = schemaValidator(signinSchema, req.body)
    const userWithToken = await authService.login(validatedLoginData)
    res.json(userWithToken)
  }

  async delete(req, res) {
    await userService.removeUser(req.email)
    res.json({
      status: "success"
    })
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