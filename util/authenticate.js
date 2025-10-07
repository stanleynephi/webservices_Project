//check if the user is authenticated to make needed changes to the products
const isAuthenticate = (req, res, next) => {
  if (!req.session.user) {
    return res
      .status(401)
      .json("You do not have access to visit this route. Thank you.")
  }

  next()
}

module.exports = { isAuthenticate }
