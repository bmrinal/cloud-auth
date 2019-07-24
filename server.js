const app = require("express")();
const helmet = require("helmet");
const bodyParser = require("body-parser");
const passport = require("passport");

//user router
const user = require("./router");

//passport strategies
const localstrategy = require("./passport-strategies/local"); //localstrategy
const tokenstrategy = require("./passport-strategies/unique-token"); // tokenstrategy

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
  const redis = app.get("redis");

  //passport configuration
  passport.use(localstrategy(db)); //local strategy
  passport.use(tokenstrategy(redis)); //token strategy

  app.use("/user", user(db, redis, passport)); //loading user routes

  app.listen(port, () => console.log(`Auth service running on port ${port}`));
});
