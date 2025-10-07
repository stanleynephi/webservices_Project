//connect to the database and connect to the usercollection in there
const { client } = require("../database/index")
const createError = require("http-errors")
const { ObjectId } = require("mongodb")

//list all the collections in the database
const listAllCollection = async function () {
  const database = client.db("project01")

  if (!database) {
    console.log("No database found")
  }

  //list all the collections found in the database by just the name
  const collections = []
  const collection = database.listCollections({}, { nameOnly: true })

  for await (const docs of collection) {
    collections.push(docs.name)
  }

  return collections
}

//add a new user to the database
const addnewUser = async function (userdata) {
  //gets the data, connect to the the database and add the client
  const database = client.db("project01")
  const collection = database.collection("user")

  if (!collection) {
    console.log("No database collection found")
    return
  }

  const result = await collection.insertOne(userdata)
  if (!result) {
    console.log(`Product was not added to the database`, result)
    return
  }

  return result
}

module.exports = {
  addnewUser,
}
