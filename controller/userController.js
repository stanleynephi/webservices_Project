const model = require("../model/userModel")
const createError = require("http-errors")
const controller = {}

controller.addNewUserorLogin = async function (userData) {
  const data = userData

  if (!data) return null

  // Check if the user exists
  const existingUser = await model.existingUser(data)
  if (existingUser) {
    console.log("User account found in the database")
    return existingUser
  }

  // If not, add new user
  const newUser = await model.addnewUser(data)
  if (newUser) {
    console.log("New user added", newUser)
    return newUser
  }

  return null
}

//logout
controller.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err)
      return res.status(500).send("Error logging out")
    }

    // Clear cookie explicitly (good practice)
    res.clearCookie("sessionId")

    // Then redirect to a valid path
    res.redirect("/user/")
  })
}

/**get all users in the collection */
controller.allUsers = async function (req, res, next) {
  //get all the items in the shop {
  try {
    const users = await model.getAllUsers()
    res.status(200).json(users)
    return users
  } catch (error) {
    console.log(error)
    next(error)
  }
}

/**get user by id */
controller.userByID = async function (req, res, next) {
  const userid = req.params.userid
  console.log(userid)
  /**pass it to the model to query the db */
  const result = await model.getuserById(userid)
  console.log(result)
  res.status(200).json(result)
  return result
}
module.exports = controller
