//connect to the database and connect to the usercollection in there
const { client } = require("../database/index")
const createError = require("http-errors")
const { ObjectId } = require("mongodb")
const { getallItems } = require("../controller")

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

/**model to check for exiting user in the collection using the provided id and profile infromation*/
const existingUser = async function (user) {
  try {
    const database = client.db("project01")
    const collection = database.collection("user")

    if (!collection) {
      console.log(`Collection not found in the database`)
      return
    }

    const result = await collection.findOne({ usergitID: user.usergitID })
    return result
  } catch (error) {
    console.log(error)
  }
}

//retrieve all the data in the shops
const getAllUsers = async function () {
  //connect to database and the connect to the client
  const database = client.db("project01")
  const collection = database.collection("user")

  if (!collection) {
    console.log("No collection found for ", collection)
    return []
  }

  const data = await collection.find({}).limit(100).toArray()

  if (!data || data.length === 0) {
    throw createError(404, "No User available data at the moment")
  }

  console.log(data)
  return data
}

const getuserById = async function (userid) {
  try {
    //pass the id to the object model
    console.log(userid)
    const database = client.db("project01")
    const collection = database.collection("user")

    let _ID

    _ID = new ObjectId(userid)
    console.log(_ID)

    //find in the collection
    if (!collection) {
      console.log("No collection available")
      return []
    }

    const user = await collection.findOne({ _id: _ID })
    console.log("this is the data found for the user", user)

    if (!user) {
      console.log("No user found with this ID")
      throw createError(404, "No user with the id found")
    }

    return user
  } catch (error) {
    console.log(error)
    throw error
  }
}
module.exports = {
  addnewUser,
  existingUser,
  getAllUsers,
  getuserById,
}
