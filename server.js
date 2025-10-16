//application set up using express js
const express = require("express")
const app = express()
const database = require("./database/index")
const passport = require("passport")
const cors = require("cors")
const passportStrategies = require("passport-github2").Strategy
const sessions = require("express-session")
const createError = require("http-errors")
const swaggerUI = require("swagger-ui-express")
const swaggerDocumentation = require("./swagger-output.json")
const authenticate = require("./util/authenticate")
const user = require("./router/user")
const shop = require("./router/shop")
const product = require("./router/index")
const userModel = require("./model/userModel")
require("dotenv").config()

//port and host
const host = process.env.Host || "localhost"
const port = process.env.Port || 8080

//set up the application to run
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//cors set up
app.use(cors())

//set up the route for the
app.use(
  sessions({
    secret: process.env.SESSION_SECRET,
    resave: false,
    name: "sessionId",
    saveUninitialized: true,
  })
)

//inititalize passports and sessions
app.use(passport.initialize())
app.use(passport.session())

//swagger setup
app.use(
  "/api-documentation",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocumentation)
)

app.use("/products", product)
app.use("/user", user)
app.use("/shops", shop)

/**
 *  #swagger.ignore = true
 */
app.use("/logout", require("./controller/userController").logout)

//set up passport in the application
passport.use(
  new passportStrategies(
    {
      //github clientID,secret and callbackURL
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log(`This is the user profile`, profile)
      /**create a new user in the database using the profile given */
      return done(null, profile)
      //})
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

//check the session if it is set or not
app.get("/", (req, res) => {
  if (req.session.user) {
    res.setHeader("Refresh", "3;url=/api-documentation")
    res.send(`Logged in as ${req.session.user.username}. Redirecting...`)
  } else {
    res.send("Logged Out, visit '/user/login' to log in to this application")
  }
})

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message || "Something went wrong")
})

//set up error handling in the application using http-errors
app.use((req, res, next) => {
  //create error handliner
  next(createError(404, "Not found"))
})

//set the listening port
app.listen(port, async () => {
  console.log(`application is running on localhost ${port}`)
  await database.run()
})
