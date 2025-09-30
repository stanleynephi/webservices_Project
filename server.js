//application set up using express js
const express = require("express")
const app = express()
const database = require("./database/index")
const collection = require("./model/index")
const createError = require("http-errors")
require("dotenv").config()

//port and host
const host = process.env.Host || "localhost"
const port = process.env.Port || 8080

//set up the application to run
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//set up the route for the
app.use("/", require("./router"))

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
  database.run()
  collection.listAllCollection()
})
