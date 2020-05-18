const app = require('express')()
const helmet = require('helmet')
const bodyParser = require('body-parser')
const passport = require('passport')
const db = require('./db')

//passport strategies
const localStrategy = require('./passport-strategies/local') //localstrategy
const tokenStrategy = require('./passport-strategies/unique-token') // tokenstrategy
passport.use(localStrategy())
passport.use(tokenStrategy())

//custom middlewares
const requestLogger = require('./middlewares/requestLogger')
const bodyParserErrors = require('./middlewares/bodyParserErrors')
const errorHandler = require('./middlewares/errorHandler')
//application port
const port = 3000

//Middlewares
app.use(helmet())
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(bodyParserErrors) //handles JSON parsing errors
app.use(requestLogger)


const start = async () => {
  await db.init()
  //routes
  const routes = require('./routes')
  app.use('/', routes)
  app.use(errorHandler)
  app.listen(port, () => console.log(`Auth service running on port ${port}`))
}
start()





