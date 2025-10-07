//user routing
const router = require("express").Router()
// const controller = require("../controller/userController.js")
const passport = require("passport")
//signup and add a new user to our user data in our database
router.get("/login", passport.authenticate("github", { scope: ["user:email"] }))

//login and logout routes
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api-documentation",
  }),
  (req, res) => {
    req.session.user = req.user
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
)

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.redirect("/")
  })
})

module.exports = router
