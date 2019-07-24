const winston = require("winston");
const path = require("path");

module.exports = {
  db: winston.createLogger({
    format: winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: {
      timestamp:
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
    },
    transports: [
      new winston.transports.File({
        filename: path.join("logs", "database.log")
      })
    ]
  }),
  access: winston.createLogger({
    format: winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: {
      timestamp:
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
    },
    transports: [
      new winston.transports.File({ filename: path.join("logs", "access.log") })
    ]
  })
};
