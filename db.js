const MongoClient = require('mongodb').MongoClient;
const redis = require('redis')
const asyncRedis = require("async-redis")
const logger = require('./utils/logger');
const config = require('./config')

class DbInit {
  async init() {
    await this.connectMongo()
    await this.connectRedis()
  }

  connectRedis() {
    return new Promise((resolve, reject) => {
      const url = `${config.redis.connectionString}:${config.redis.port}`
      const redisClient = asyncRedis.createClient(url)
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
      const url = `${config.mongodb.connectionString}:${config.mongodb.port}`
      const mongoClient = new MongoClient(url, { useNewUrlParser: true })
      mongoClient.connect((err) => {
        if (!err) {
          this.mongoDb = mongoClient.db(config.mongodb.dbName)
          logger.db.info(`Connected to database - ${config.mongodb.dbName}`)
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

