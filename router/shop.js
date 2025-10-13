const express = require("express")
const router = express.Router()
const controller = require("../controller/shopController")
const authenticate = require("../util/authenticate")

/**
 * @swagger
 * tags:
 *   name: Shops
 *   description: Shop management endpoints
 */

/**
 * @swagger
 * /shops/allShops:
 *   get:
 *     summary: Retrieve all shops
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all shops
 */
router.get("/allShops", authenticate.isAuthenticate, controller.getAllShop)

/**
 * @swagger
 * /shops/getSpecificShop/{id}:
 *   get:
 *     summary: Get a specific shop by ID
 *     tags: [Shops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The shop ID
 *     responses:
 *       200:
 *         description: Shop details
 *       404:
 *         description: Shop not found
 */
router.get(
  "/getSpecificShop/:id",
  authenticate.isAuthenticate,
  controller.getShopbyId
)

/**
 * @swagger
 * /shops/addNewShop:
 *   post:
 *     summary: Add a new shop
 *     tags: [Shops]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shop_name:
 *                 type: string
 *               location:
 *                 type: string
 *               owner:
 *                 type: string
 *     responses:
 *       201:
 *         description: Shop created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/addNewShop", authenticate.isAuthenticate, controller.addNewShop)

/**
 * @swagger
 * /shops/updateShopInformation:
 *   put:
 *     summary: Update shop information
 *     tags: [Shops]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shop_id:
 *                 type: string
 *               shop_name:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Shop updated successfully
 *       404:
 *         description: Shop not found
 */
router.put(
  "/updateShopInformation/:id",
  authenticate.isAuthenticate,
  controller.updateShopData
)

/**
 * @swagger
 * /shops/deleteShop/{id}:
 *   delete:
 *     summary: Delete a shop by ID
 *     tags: [Shops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The shop ID
 *     responses:
 *       200:
 *         description: Shop deleted successfully
 *       404:
 *         description: Shop not found
 */
router.delete(
  "/deleteShop/:id",
  authenticate.isAuthenticate,
  controller.deleteShop
)

module.exports = router
