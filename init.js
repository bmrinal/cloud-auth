const mongo = require('./db');
module.exports = (app) => {
    mongo.connect().then((err)=>{
        if(!err)
        {
            throw 'unable to connect to db'
        }
        else
        {
            const db = mongo.setDB('fueleye');
            app.set('db',db);
            app.emit('ready') 
        }
    })   
}

