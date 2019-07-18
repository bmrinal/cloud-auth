const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://mongo:27017";
const client = new MongoClient(url, { useNewUrlParser: true });
const logger = require("./utils/logger");

module.exports = app => {
  //connecting to db
  client.connect((err, db) => {
    if (!err) {
      app.set("db", client.db("fueleye"));
      logger.db.info("Connected to database - fueleye");


      //setting connection termination on app close/abort/restart
      process.on('SIGINT', () => {
        MongoClient.close()
      });

      // AND we are ready - wrooooom!
      app.emit("ready");

    } else {
      logger.db.error(err);
    }
  });
};
