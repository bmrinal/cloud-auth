const MongoClient = require('mongodb').MongoClient;
const redis = require('redis');
const url = 'mongodb://mongo:27017';
const client = new MongoClient(url, { useNewUrlParser: true });
const logger = require('./utils/logger');

module.exports = app => {
  //redis session connection
  const redisConnected = new Promise((resolve, reject) => {
    const redisClient = redis.createClient('redis://redis:6379');
    redisClient.on('ready', () => {
      app.set('redis', redisClient);
      logger.db.info('Connected to redis cache');
      //AND we are connected
      resolve();
    });
    redisClient.on('error', err => {
      logger.db.error(`Error connecting to redis - ${err}`);
      reject(err);
    });
  });

  // mongodb connection
  const mongodbConnected = new Promise((resolve, reject) => {
    //connecting to db
    client.connect((err, db) => {
      if (!err) {
        app.set('db', client.db('fueleye'));
        logger.db.info('Connected to database - fueleye');

        //setting connection termination on app close/abort/restart
        process.on('SIGINT', () => {
          MongoClient.close();
        });

        //AND we are connected
        resolve();
      } else {
        logger.db.error(err);
        reject(err);
      }
    });
  });

  Promise.all([redisConnected, mongodbConnected]).then((redis, mongo) => {
    //AND we are ready - wroooom!
    app.emit('ready');
  });
};
