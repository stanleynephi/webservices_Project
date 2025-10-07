const router = require("express").Router()
const controller = require("../controller")
const swaggerUI = require("swagger-ui-express")
const swaggerDocumentation = require("../swagger-output.json")
const validation = require("../util/index")
const authenticate = require("../util/authenticate")

//swagger set up
router.use("/api-documentation", swaggerUI.serve)
router.get("/api-documentation", swaggerUI.setup(swaggerDocumentation))

//set up router using http verb and export
//this router gets all the data found in the database
router.get("/getAll", authenticate.isAuthenticate, controller.getallItems)

//this route gets the product based of the provided id
router.get("/getProduct/:id", controller.getitembyID)

//delete route
//deletes a products based on the id provided
router.delete(
  "/deleteProduct/:id",
  authenticate.isAuthenticate,
  controller.deleteitembyID
)

//post route
//adds a new product to the database
router.post(
  "/addnewProduct",
  authenticate.isAuthenticate,
  validation.validateDataInput,
  controller.addnewProduct
)

//put route
//update an existing product based of the given id
router.put(
  "/updateProduct/:id",
  authenticate.isAuthenticate,
  controller.updateproductDetails
)

module.exports = router
