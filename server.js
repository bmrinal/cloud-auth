const express = require('express');
const helmet = require ('helmet');
const bodyParser = require('body-parser');

//The APP!
const app = express();
const port = 3000;

//Middlewares
app.use(helmet());
app.use(bodyParser.json());

//initializes the db connections and other bootstrapping
const init = require('./init')(app);

//data adapter 
const adapter = require('./adapter');

//database operations
const dbops = require('./dbops');

//responder (formats and sends the appropriate response codes and responses to the client)
const respond = require('./respond');

app.on('ready',()=>{
    
    //grab the db handle
    const db = app.get('db');

    //routes
    app.post('/signup',async(req,res)=>{
        const dbresults = await dbops.insertUser(db,adapter.getUsers(req.body));
        respond.dbops(res,dbresults);
    })
    
    app.listen(port,()=>console.log(`Auth service running on port ${port}`));
})