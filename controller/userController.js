const model = require("../model/userModel")
const createError = require("http-errors")
const controller = {}

controller.addNewUser = async function (req, res, next) {
  //get the user data from the OAuth
  const data = req.body
  console.log(data)
}
module.exports = controller
