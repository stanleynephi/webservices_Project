/**require the client, http-errors and objectId */
const { client } = require("../database/index")
const createError = require("http-errors")
const { ObjectId } = require("mongodb")

//retrieve all the data in the shops
const getAllShops = async function () {
  //connect to database and the connect to the client
  const database = client.db("project01")
  const collection = database.collection("shop")

  if (!collection) {
    console.log("No collection found for ", collection)
    return []
  }

  const data = await collection.find({}).limit(100).toArray()

  if (!data || data.length === 0) {
    throw createError(404, "No Shops available data at the moment")
  }

  console.log(data)
  return data
}

//get shops based of the id.
const getShopbyID = async function (id) {
  try {
    //pass the id to the object model
    console.log(id)
    const database = client.db("project01")
    const collection = database.collection("shop")

    let _ID

    _ID = new ObjectId(id)

    //find in the collection
    if (!collection) {
      console.log("No collection available")
      return []
    }

    const data = await collection.findOne({ _id: _ID })
    console.log("this is the data found for the shop", data)

    if (!data) {
      console.log("No shop found with this ID")
      throw createError(404, "No Shop with the id found")
    }

    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

//get the item based of the provided id
const deleteShopbyId = async function (id) {
  //trycatch
  try {
    const database = client.db("project01")
    const collection = database.collection("shop")
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
const newShop = async function (shopDetails, id) {
  try {
    const database = client.db("project01")
    const collection = database.collection("shop")
    const { shopName } = shopDetails

    if (!collection) {
      return
    }

    //check for shopname in the database if shop already exisit dont add the new shop under that name
    const shop = await collection.findOne({
      shopName: { $regex: new RegExp(`^${shopName}$`, "i") },
    })

    if (shop) {
      console.log("Shop already exist")
      throw createError(500, "A similar shop already exisit")
    }

    const products = await collection.insertOne(shopDetails)

    if (!products) {
      console.log("Product was not added")
      return
    }

    return products
  } catch (error) {
    console.log(error)
    throw error
  }
}

//update the data
const updateShopInformation = async function (id, updateData) {
  try {
    const database = client.db("project01")
    const collection = database.collection("shop")

    const _ID = new ObjectId(id)

    //run the update insert
    const filter = { _id: _ID }
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

//export the model
module.exports = {
  getAllShops,
  getShopbyID,
  deleteShopbyId,
  newShop,
  updateShopInformation,
}
