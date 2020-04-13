const MongoClient = require('mongodb').MongoClient;
const redis = require('redis')
const logger = require('./utils/logger');

class DbInit {
  async init() {
    await this.connectMongo()
    await this.connectRedis()
  }

  connectRedis() {
    return new Promise((resolve, reject) => {
      const redisClient = redis.createClient('redis://redis:6379')
      redisClient.on('ready', () => {
        this.redis = redisClient
        logger.db.info('Connected to redis cache')
        resolve();
      });
      redisClient.on('error', err => {
        reject(`Error connecting to redis - ${err}`)
      });
    });
  }


  connectMongo() {
    return new Promise((resolve, reject) => {
      const url = 'mongodb://mongo:27017'
      const mongoClient = new MongoClient(url, { useNewUrlParser: true })
      mongoClient.connect((err) => {
        if (!err) {
          this.mongoDb = mongoClient.db('fuel-eye')
          logger.db.info('Connected to database - fueleye')
          process.on('SIGINT', () => {
            MongoClient.close();
          })
          resolve()
        } else {
          reject(`Error connecting to MongoDB - ${err}`)
        }
      })
    })
  }
}


module.exports = new DbInit()

