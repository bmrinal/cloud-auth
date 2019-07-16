const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://mongo:27017'
const client = new MongoClient(url,{ useNewUrlParser: true });

module.exports = {
    connect: ()=>client.connect(),
    setDB: (dbname)=>client.db(dbname),
    close: ()=>client.close()
}