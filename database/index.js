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
    await client.connect()
    const database = client.db("project01")
    if (database) {
      console.log("database connection established")
    }

    const collections = await database.listCollections().toArray()
    const name = collections.map((c) => c.name)

    if (!name.includes("shopify")) {
      await database.createCollection("shopify")
      console.log("Shopify collection created")
    }

    if (!name.includes("user")) {
      await database.createCollection("user")
      console.log("User collection created")
    }

    if (!name.includes("shops")) {
      await database.createCollection("shops")
      console.log("Shops collection created")
    }
    return database
  } catch (error) {
    console.log(error)
  }
}

module.exports = { run, client }
