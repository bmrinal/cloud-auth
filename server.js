const app = require("express")();
const helmet = require("helmet");
const bodyParser = require("body-parser");
const passport = require("passport");

const respond = require("./utils/respond"); //responder (formats and sends the appropriate response codes and responses to the client)
const adapter = require("./adapter"); //data adapter
const dbops = require("./dbops"); //database operations
const getToken = require("./utils/token-generator"); //JWT token generator


//passport strategies
const localstrategy = require("./passport-strategies/local"); //localstrategy
const tokenstrategy = require ("./passport-strategies/unique-token") // tokenstrategy


//custom middlewares
const requestLogger = require("./middlewares/requestLogger");
const bodyParserErrors = require("./middlewares/bodyParserErrors");

//application port
const port = 3000;

//Middlewares
app.use(helmet());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(bodyParserErrors); //handles JSON parsing errors
app.use(requestLogger); //logs all the accesses

//initializes the db connections and other bootstrapping
const init = require("./init")(app);

app.on("ready", () => {
  //grab the db handle
  const db = app.get("db");
  const redis = app.get('redis')
  
  //passport configuration 
  passport.use(localstrategy(db)); //local strategy
  passport.use(tokenstrategy(redis)); //token strategy


  //********* APPLICATION ROUTES ******* */

  //signup
  app.post("/signup", async (req, res, next) => {
    const dbresults = await dbops.insertUser(db, adapter.getUsers(req.body));
    respond.dbops(res, dbresults);
    next();
  });

  //signin
  app.post(
    "/signin",
    passport.authenticate("local", { session: false }),
    (req, res, next) => {
        respond.success(res,{token: getToken(req.user)})
    }
  );

  //signout
  app.post('/signout',passport.authenticate('token',{session:false}), (req,res,next)=>{  
    redis.del(req.user.token,(err,reply)=>{
          if(!err)
          {
              respond.success(res,"User signed out successfully")
          }
          else
          {
              respond.internalError(res)
          }
      })
  });

  //verify token
  app.post('/verify-token',passport.authenticate('token',{session:false}),(req,res)=>{
    //refreshing the token
    redis.expire(req.user.token, 1800);
    respond.success(res,'Token valid')
  })

  app.listen(port, () => console.log(`Auth service running on port ${port}`));
});
