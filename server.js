const app = require('express')();
const helmet = require('helmet');
const bodyParser = require('body-parser');
const passport = require('passport');

//user router
const routes = require('./routes');

//passport strategies
const localstrategy = require('./passport-strategies/local'); //localstrategy
const tokenstrategy = require('./passport-strategies/unique-token'); // tokenstrategy

//custom middlewares
const requestLogger = require('./middlewares/requestLogger');
const bodyParserErrors = require('./middlewares/bodyParserErrors');

//application port
const port = 3000;

//Middlewares
// app.use(helmet());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(bodyParserErrors); //handles JSON parsing errors
app.use(requestLogger); //logs all the accesses

//initializes the db connections and other bootstrapping
const init = require('./init')(app);

app.on('ready', () => {
  //passport configuration
  passport.use(localstrategy(app.get('db'))); //local strategy
  passport.use(tokenstrategy(app.get('redis'))); //token strategy

  //loading application routes
  app.use(
    '/',
    routes({ db: app.get('db'), redis: app.get('redis'), passport: passport })
  );

  app.listen(port, () => console.log(`Auth service running on port ${port}`));
});
