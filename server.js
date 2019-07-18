const app = require('express')();
const helmet = require ('helmet');
const bodyParser = require('body-parser');
const passport = require('passport');


const respond = require('./utils/respond'); //responder (formats and sends the appropriate response codes and responses to the client)
const adapter = require('./adapter'); //data adapter 
const dbops = require('./dbops'); //database operations

//custom middlewares
const requestLogger = require('./middlewares/requestLogger');
const bodyParserErrors = require('./middlewares/bodyParserErrors');

//application port
const port = 3000;

//Middlewares
app.use(helmet());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(bodyParserErrors); //handles JSON parsing errors
app.use(requestLogger); //logs all the accesses

//basic passport configuration (local-strategy)
passport.use(new LocalStrategy({
    usernameField: 'email'
},(username,password,done)=>{
    const db = app.get('db');
    db.collection('users').findOne({email:username,password:password},(err,user)=>{
        if(err) {return done(err)}
        if(!user) {return done(null,false,'Incorrect username/password')}
        return (done(null,user));
    })
}))



//initializes the db connections and other bootstrapping
const init = require('./init')(app);

app.on('ready',()=>{
    
    //grab the db handle
    const db = app.get('db');

    //routes
    
    //signup
    app.post('/signup',async(req,res,next)=>{
        const dbresults = await dbops.insertUser(db,adapter.getUsers(req.body));
        respond.dbops(res,dbresults);
        next();
    })

    
    app.post('/signin', passport.authenticate('local',{session:false}),(req,res,next)=>{
        
        res.send('Authenticated')
    });


    app.listen(port,()=>console.log(`Auth service running on port ${port}`));
})