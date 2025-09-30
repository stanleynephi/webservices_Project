//require the needed things for the validation body and result
const { body, validationResult } = require("express-validator")
const validator = {}
const createError = require("http-errors")

//set rules for validation
validator.ValidationRules = () => {
  return [
    body("productName")
      .trim()
      .notEmpty()
      .withMessage("Product name is required")
      .isString()
      .withMessage("Product name must be a string")
      .isLength({ min: 2 })
      .withMessage("Product name must be at least 2 characters long")
      .custom((value) => {
        const invalid = ["any", "n/a", "null", "undefined"]
        if (invalid.includes(value.toLowerCase())) {
          throw new Error("Invalid last name")
        }
        return true
      }),

    body("productCategory")
      .trim()
      .notEmpty()
      .withMessage("Product category is required")
      .isString()
      .withMessage("Product category must be a string")
      .isLength({ min: 2 })
      .withMessage("Product category must be at least 2 characters long")
      .custom((value) => {
        const invalid = ["any", "n/a", "null", "undefined"]
        if (invalid.includes(value.toLowerCase())) {
          throw new Error("Invalid last name")
        }
        return true
      }),

    body("productPrice")
      .notEmpty()
      .withMessage("Product price is required")
      .isFloat({ gt: 0 })
      .withMessage("Product price must be a valid number greater than 0")
      .custom((value) => {
        const invalid = ["any", "n/a", "null", "undefined"]
        if (invalid.includes(value.toLowerCase())) {
          throw new Error("Invalid last name")
        }
        return true
      }),

    body("productQuantity")
      .notEmpty()
      .withMessage("Product quantity is required")
      .isInt({ min: 0 })
      .withMessage(
        "Product quantity must be a number greater than or equal to 0"
      )
      .custom((value) => {
        const invalid = ["any", "n/a", "null", "undefined"]
        if (invalid.includes(value.toLowerCase())) {
          throw new Error("Invalid last name")
        }
        return true
      }),

    body("productDescription")
      .trim()
      .notEmpty()
      .withMessage("Product description is required")
      .isString()
      .withMessage("Product description must be a string")
      .isLength({ min: 5 })
      .withMessage("Product description must be at least 5 characters long")
      .custom((value) => {
        const invalid = ["any", "n/a", "null", "undefined"]
        if (invalid.includes(value.toLowerCase())) {
          throw new Error("Invalid last name")
        }
        return true
      }),
  ]
}

//validator validation
validator.validateDataInput = async function (req, res, next) {
  try {
    const {
      productName,
      productCategory,
      productPrice,
      productQuantity,
      productDescription,
    } = req.body

    if (
      !productName &&
      !productCategory &&
      !productPrice &&
      !productQuantity &&
      !productDescription
    ) {
      throw createError(400, "No Data Information Provided")
    }

    const error = validationResult(req)

    if (!error.isEmpty()) {
      return res.status(400).json({
        error: error.array(), // send array of error objects
      })
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = validator
