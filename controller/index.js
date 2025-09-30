const { ObjectId } = require("mongodb")
const model = require("../model")
const createError = require("http-errors")
const controller = {}

//get all items
controller.getallItems = async function (req, res, next) {
  //try catch
  try {
    const items = await model.getAllItems()
    res.status(200).json(items)
    console.log(items)
    return items
  } catch (error) {
    console.log(error)
    next(error)
  }
}

//get item by id
controller.getitembyID = async function (req, res, next) {
  //try catch
  try {
    //get the id of the object
    const id = new ObjectId(req.params.id)
    //pass the id to the model to search for it in the database
    const item = await model.getItembyId(id)
    //return the item in json format
    res.status(200).json(item)
    console.log(item)
    return item
  } catch (error) {
    if (error.name === "BSONError") {
      return next(createError(400, "Invalid Product Id"))
    }
    next(error)
  }
}

//get item by id
controller.deleteitembyID = async function (req, res, next) {
  //try catch
  try {
    console.log("router hit")
    //get the id of the object
    const id = req.params.id
    //pass the id to the model to search for it in the database
    const item = await model.deleteItembyId(id)
    //return the item in json format
    res.status(200).json({ message: "Item removed from store" })
  } catch (error) {
    if (error.name === "BSONError") {
      return next(createError(400, "Invalid Product Id"))
    }
    next(error)
  }
}

//add new item to the database
controller.addnewProduct = async function (req, res, next) {
  //trycatch to handle the input being sent in from the forms that it meets the requirements
  try {
    //test to make sure the router is hitting this funtion
    console.log("router hit")
    //get all the data coming from the forms
    const data = {
      productname: req.body.productName,
      productcategory: req.body.productCategory,
      productprice: Number(req.body.productPrice),
      productquantity: Number(req.body.productQuantity),
      productdescription: req.body.productDescription,
    }
    console.log(data)

    if (!data || Object.keys(data).length === 0) {
      throw createError(500, "No data provided to be inserted")
    }

    const addproduct = await model.newProduct(data)

    if (!addproduct) {
      throw createError(400, "Product was not added to the database")
    }

    res.status(200).json({ message: "Product Was Added Successfully" })
  } catch (error) {
    next(error)
  }
}

//update the data in the database
controller.updateproductDetails = async function (req, res, next) {
  try {
    console.log("router hit")
    const data = req.body
    const id = req.params.id

    // get existing item (to verify it exists)
    const exisitingProduct = await model.getItembyId(id)
    if (!exisitingProduct) {
      throw createError(404, "Product not found")
    }

    // build updateData dynamically
    const updateData = {}

    if (data.productName && data.productName.trim() !== "any") {
      updateData.productname = data.productName
    }

    if (data.productCategory && data.productCategory.trim() !== "any") {
      updateData.productcategory = data.productCategory
    }

    if (data.productPrice !== undefined && data.productPrice !== "any") {
      updateData.productprice = Number(data.productPrice)
    }

    if (data.productQuantity !== undefined && data.productQuantity !== "any") {
      updateData.productquantity = Number(data.productQuantity)
    }

    if (data.productDescription && data.productDescription.trim() !== "any") {
      updateData.productdescription = data.productDescription
    }

    console.log("Final update data:", updateData)

    // prevent empty updates
    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided to update" })
    }

    // update the information
    const update = await model.updateProduct(id, updateData)

    if (!update.modifiedCount) {
      throw createError(400, "Product Update Not Successful")
    }

    res.status(200).json({ message: "Update Successful" })
  } catch (error) {
    if (error.name === "BSONError") {
      throw createError(404, `Product Id is Invalid`)
    }
    next(error)
  }
}

module.exports = controller
