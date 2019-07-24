const router = require("express").Router();

const respond = require("./utils/respond"); //responder (formats and sends the appropriate response codes and responses to the client)
const adapter = require("./adapter"); //data adapter
const dbops = require("./dbops"); //database operations
const getToken = require("./utils/token-generator"); //JWT token generator

module.exports = (db, redis, passport) => {
  //signup
  router.post("/signup", async (req, res, next) => {
    const dbresults = await dbops.insertUser(db, adapter.getUsers(req.body));
    respond.dbops(res, dbresults);
    next();
  });

  //signin
  router.post(
    "/signin",
    passport.authenticate("local", { session: false }),
    (req, res, next) => {
      respond.success(res, { token: getToken(req.user) });
    }
  );

  //signout
  router.post(
    "/signout",
    passport.authenticate("token", { session: false }),
    (req, res, next) => {
      redis.del(req.user.token, (err, reply) => {
        if (!err) {
          respond.success(res, "User signed out successfully");
        } else {
          respond.internalError(res);
        }
      });
    }
  );

  //verify token
  router.post(
    "/verify-token",
    passport.authenticate("token", { session: false }),
    (req, res) => {
      //refreshing the token
      redis.expire(req.user.token, 1800);
      respond.success(res, "Token valid");
    }
  );

  //change password
  router.post(
    "/change-password",
    passport.authenticate("token", { session: false }),
    async (req, res, next) => {
      const changePassword = await dbops.changeUserPassword(
        db,
        req.user.email,
        req.body.oldPassword,
        req.body.newPassword
      );
      if (changePassword === "success") {
        redis.del(req.user.token);
        respond.success(res, "Password changed");
      } else {
        respond.dbops(res, changePassword);
      }
    }
  );

  return router;
};
