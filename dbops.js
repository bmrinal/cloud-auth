const logger = require("./utils/logger");
module.exports = {
  insertUser: async (db, user) => {
    //validations TODO: SANITIZE INPUTS
    if (user.email === "" || user.password === "") {
      logger.db.error("Invalid/Blank email and/or password supplied");
      return "invalid";
    }

    //check duplicates
    const existingEmails = await db
      .collection("users")
      .find({ email: user.email })
      .count();
    const existingUsernames = await db
      .collection("users")
      .find({ username: user.username })
      .count();

    if (existingEmails || (user.username !== "" && existingUsernames)) {
      logger.db.error(`User already exists -  ${user.email}`);
      return "duplicate";
    } else {
      try {
        const dbResponse = await db.collection("users").insertOne(user);
        logger.db.info(`User successfully Provisioned -  ${user.email}`);
        return "success";
      } catch (err) {
        logger.db.error(err);
        return "internal error";
      }
    }
  },
  changeUserPassword: async (db, email, oldPassword, newPassword) => {
    //validations TODO: SANITIZE INPUTS
    if (!email || !oldPassword || !newPassword) {
      return "invalid";
    }

    const user = await db.collection("users").findOne({ email: email });
    if (user && user.password === oldPassword) {
      try {
        await db.collection("users").findOneAndUpdate(
          { email: email },
          {
            $set: { password: newPassword }
          }
        );
        logger.db.info(`Password update successfully - ${email}`);
        return "success";
      } catch (err) {
        logger.db.error(err);
        return "internal error";
      }
    } else {
      return "invalid";
    }
  }
};
