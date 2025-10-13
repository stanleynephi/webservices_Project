/**shops controller, requires the model and error handling features */
const createError = require("http-errors")
const model = require("../model/shopModel")
const { ObjectId } = require("mongodb")
const controller = {}

//get all the items in the shop
controller.getAllShop = async function (req, res, next) {
  try {
    const shops = await model.getAllShops()
    res.status(200).json(shops)
    return shops
  } catch (error) {
    console.log(error)
    next(error)
  }
}

//get the id from the forms and send it over to the model
controller.getShopbyId = async function (req, res, next) {
  try {
    //get the id
    const id = new ObjectId(req.params.id)
    const shop = await model.getShopbyID(id)
    console.log("Datafound in the shop under the controller", shop)

    if (!shop) {
      console.log("There are no available shops")
      return []
    }

    res.status(200).json(shop)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

//delete shop from database
controller.deleteShop = async function (req, res, next) {
  try {
    //get the shop id from the router
    const id = req.params.id
    const shop = await model.deleteShopbyId(id)

    res
      .status(200)
      .json({ message: "Shop has been removed fromt the database" })
  } catch (error) {
    if (error.name === "BSONError") {
      return next(createError(400, "Invalid product Id"))
    }

    next(error)
  }
}

//add new shop
controller.addNewShop = async function (req, res, next) {
  //try catch to handle errors
  try {
    const data = {
      shopName: req.body.shopname,
    }

    console.log(data)

    if (!data || data.length === 0) {
      console.log("No shop information provided")
      throw createError(500, "No shop data provided")
    }

    const addShop = await model.newShop(data)

    if (!addShop) {
      console.log("Shop was not addede to the database")
      throw createError(400, "Shop was not added")
    }

    res.status(200).json({ message: "New Shop added successfully" })
  } catch (error) {
    console.log(`Error found in the above code ${error}`)
    next(error)
  }
}

//upadte shop data
controller.updateShopData = async function (req, res, next) {
  try {
    //try catch to handle error as updated data is been compared to the existing data before adding it to the database
    const shopData = req.body
    console.log(shopData)
    const shopId = req.params.id

    //retrieve existing data from the database
    const existingShop = await model.getShopbyID(shopId)
    console.log(existingShop)
    if (!existingShop) {
      throw createError(404, "Shop not found with the provided ID")
    }

    //build the update information
    const shopUpdateData = {}

    if (shopData.shopname && shopData.shopname.trim() !== "any") {
      shopUpdateData.shopname = shopData.shopname
    }

    console.log("Update data for the shop", shopUpdateData)

    //handle empty update
    if (Object.keys(shopUpdateData).length === 0) {
      return res.status(400).json({ message: "No valid data provided" })
    }

    //pass the update
    const updateResult = await model.updateShopInformation(
      shopId,
      shopUpdateData
    )

    if (!updateResult) {
      throw createError(500, "Update was unsuccessful")
    }

    res.status(200).json({ message: "Update was a success" })
  } catch (error) {
    if (error.name === "BSONError") {
      throw createError(404, "Invalid shop ID")
    }
    next(error)
  }
}

module.exports = controller
