//find all the collection in the database
const { client } = require("../database/index")
const createError = require("http-errors")
const { ObjectId } = require("mongodb")

//list all the collection in our database
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

//get all model -- retrieves all data from the collection
const getAllItems = async function () {
  try {
    const database = client.db("project01")
    const collection = database.collection("shopify")

    //retrieve item from collection
    if (!collection) {
      console.log("collection not found")
      return []
    }

    const data = await collection.find({}).limit(100).toArray()

    if (!data || data.length === 0) {
      throw createError(
        404,
        "No Product available at the moment please revisit later"
      )
    }

    console.log(data)
    return data
  } catch (error) {
    throw error
  }
}

//get the item based of the provided id
const getItembyId = async function (id) {
  //trycatch
  try {
    const database = client.db("project01")
    const collection = database.collection("shopify")
    //get the id of the product we are looking for
    let _ID

    _ID = new ObjectId(id)

    //find the product using the id given
    const data = await collection.findOne({ _id: _ID })

    if (!data || data.length === 0) {
      console.log("No product under the provided id")
      throw createError(404, "No product with the given id found")
    }

    return data
  } catch (error) {
    throw error
  }
}

//get the item based of the provided id
const deleteItembyId = async function (id) {
  //trycatch
  try {
    const database = client.db("project01")
    const collection = database.collection("shopify")
    //get the id of the product we are looking for
    let _ID

    _ID = new ObjectId(id)

    //find the product using the id given
    const data = await collection.findOne({ _id: _ID })

    if (!data || data.length === 0) {
      console.log("No product under the provided id")
      throw createError(404, "No product with the given id found")
    }

    const deleteData = await collection.deleteOne({ _id: _ID })
    if (deleteData.deletedCount === 0) {
      throw createError(400, "Delete Unsuccessful")
    }
    return "Contact Deleted"
  } catch (error) {
    throw error
  }
}

//insert new Product model
const newProduct = async function (productDetails, id) {
  try {
    const database = client.db("project01")
    const collection = database.collection("shopify")

    if (!collection) {
      return
    }

    const products = await collection.insertOne(productDetails)

    if (!products) {
      console.log("Product was not added")
      return
    }

    return products
  } catch (error) {
    console.log(error)
  }
}

//update the data
const updateProduct = async function (id, updateData) {
  try {
    const database = client.db("project01")
    const collection = database.collection("shopify")

    const ID = new ObjectId(id)

    //run the update insert
    const filter = { _id: ID }
    const data = {
      $set: updateData,
    }

    const updateDataResult = await collection.updateOne(filter, data)

    if (updateDataResult.matchedCount === 0) {
      throw createError(400, `Update unsucessfull`)
    }

    return updateDataResult
  } catch (error) {
    console.error("Update error:", error)
    throw error
  }
}

module.exports = {
  listAllCollection,
  getAllItems,
  getItembyId,
  deleteItembyId,
  newProduct,
  updateProduct,
}
