const fs = require("fs");
const jwt = require("jsonwebtoken");
module.exports = user => {
  const privateKEY = fs.readFileSync("./private.key", "utf8");
  const publicKEY = fs.readFileSync("./public.key", "utf8");
  const payload = {
    email: user.email,
    role: user.role,
    publicKEY: publicKEY
  };
  const signingOptions = {
    issuer: "Cloud Auth",
    subject: user.email,
    expiresIn: "12h",
    algorithm: "RS256"
  };

  return jwt.sign(payload, privateKEY, signingOptions);
};
