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

module.exports = controller
