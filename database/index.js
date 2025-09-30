//establish a database connection using mongodb and client
require("dotenv").config()
const { MongoClient } = require("mongodb")
const uri =
  process.env.MONGODBURI ||
  "mongodb+srv://stanleynuley_db_user:zmFtqMEDFI6cNywz@cluster0.j0lnqc3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

//establish a connection to our database
const client = new MongoClient(uri)

//async function to run
async function run() {
  try {
    const database = client.db("project01")
    if (database) {
      console.log("database connection established")
    }

    const shops = database.collection("shopify")
    return shops
  } catch (error) {
    console.log(error)
  }
}

module.exports = { run, client }
