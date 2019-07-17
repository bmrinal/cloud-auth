const app = require('express')();
const helmet = require ('helmet');
const bodyParser = require('body-parser');


const respond = require('./utils/respond'); //responder (formats and sends the appropriate response codes and responses to the client)
const adapter = require('./adapter'); //data adapter 
const dbops = require('./dbops'); //database operations
const logger = require('./utils/logger'); //winston logger

//custom middlewares
const requestLogger = require('./middlewares/requestLogger');
const bodyParserErrors = require('./middlewares/bodyParserErrors');

//application port
const port = 3000;

//Middlewares

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParserErrors); //handles JSON parsing errors

//logs all the accesses
app.use(requestLogger); 

//initializes the db connections and other bootstrapping
const init = require('./init')(app);

app.on('ready',()=>{
    
    //grab the db handle
    const db = app.get('db');

    //routes
    app.post('/signup',async(req,res,next)=>{
        const dbresults = await dbops.insertUser(db,adapter.getUsers(req.body));
        respond.dbops(res,dbresults);
        next();
    })
    
    app.listen(port,()=>console.log(`Auth service running on port ${port}`));
})