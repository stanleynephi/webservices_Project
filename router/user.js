//user routing
const router = require("express").Router()
const controller = require("../controller/userController.js")
const passport = require("passport")

/**set up a default user route */
router.get("/", (req, res) => {
  res.send(`You are logged out`)
})

//signup and add a new user to our user data in our database
router.get("/login", passport.authenticate("github", { scope: ["user:email"] }))

/**login or logout */
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/",
  }),
  async (req, res) => {
    // The GitHub profile data comes from passport
    const profile = req.user

    const userData = {
      usergitID: profile.id,
      username: profile.username,
      userprofileURL: profile.profileUrl,
    }

    console.log(userData)

    // Check or add the user
    await controller.addNewUserorLogin(userData)

    // Store session data
    req.session.user = profile

    // Redirect to docs
    res.send(`
      <html>
        <head>
          <meta http-equiv="refresh" content="3;url=/api-documentation" />
        </head>
        <body style="font-family:sans-serif; text-align:center; padding-top:50px;">
          <h2>Login successful ✅</h2>
          <p>Redirecting you to the API Documentation in 3 seconds...</p>
        </body>
      </html>
    `)
  }
) /**route to log user out and delete sessions */
router.get("/logout", controller.logout)

module.exports = router
