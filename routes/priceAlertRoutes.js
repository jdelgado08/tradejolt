// const express = require('express');
// const router = express.Router();
// const { authenticateUser } = require('../middleware/authentication');
// const {
//     createPriceAlert,
//     getPriceAlerts,
//     deletePriceAlert,
//     updatePriceAlert,
//     manualTrigger,
// } = require('../controllers/priceAlertController');

// router.post('/', authenticateUser, createPriceAlert);

// router.get('/', authenticateUser, getPriceAlerts);

// router.delete('/:id', authenticateUser, deletePriceAlert);

// router.put('/:id', authenticateUser, updatePriceAlert);

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { authenticateUser } = require('../middleware/authentication');

// const {
//     createPriceAlert,
//     getPriceAlerts,
//     deletePriceAlert,
//     updatePriceAlert,
//     manualTrigger,
// } = require('../controllers/priceAlertController');

// /**
//  * @swagger
//  * tags:
//  *   name: Price Alerts
//  *   description: Manage price alerts for stock symbols
//  */

// /**
//  * @swagger
//  * /priceAlert:
//  *   post:
//  *     summary: Create a new price alert
//  *     description: Create a price alert for a specific stock symbol.
//  *     tags:
//  *       - Price Alerts
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               symbol:
//  *                 type: string
//  *               priceLevel:
//  *                 type: number
//  *               condition:
//  *                 type: string
//  *                 enum: [above, below]
//  *               userEmail:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: Price alert created successfully.
//  *       400:
//  *         description: Invalid input.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.post('/', authenticateUser, createPriceAlert);

// /**
//  * @swagger
//  * /priceAlert:
//  *   get:
//  *     summary: Get all price alerts for the authenticated user
//  *     description: Retrieve all price alerts associated with the authenticated user.
//  *     tags:
//  *       - Price Alerts
//  *     responses:
//  *       200:
//  *         description: A list of price alerts.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   id:
//  *                     type: string
//  *                   symbol:
//  *                     type: string
//  *                   priceLevel:
//  *                     type: number
//  *                   condition:
//  *                     type: string
//  *                   isActive:
//  *                     type: boolean
//  *                   hasTriggered:
//  *                     type: boolean
//  *       401:
//  *         description: Unauthorized access.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.get('/', authenticateUser, getPriceAlerts);

// /**
//  * @swagger
//  * /priceAlert/{id}:
//  *   delete:
//  *     summary: Delete a price alert
//  *     description: Delete a specific price alert by its ID for the authenticated user.
//  *     tags:
//  *       - Price Alerts
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The price alert ID
//  *     responses:
//  *       200:
//  *         description: Price alert deleted successfully.
//  *       404:
//  *         description: Price alert not found.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.delete('/:id', authenticateUser, deletePriceAlert);

// /**
//  * @swagger
//  * /priceAlert/{id}:
//  *   put:
//  *     summary: Update a price alert
//  *     description: Update a specific price alert by its ID for the authenticated user.
//  *     tags:
//  *       - Price Alerts
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The price alert ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               priceLevel:
//  *                 type: number
//  *               condition:
//  *                 type: string
//  *                 enum: [above, below]
//  *     responses:
//  *       200:
//  *         description: Price alert updated successfully.
//  *       404:
//  *         description: Price alert not found.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.put('/:id', authenticateUser, updatePriceAlert);

// /**
//  * @swagger
//  * /priceAlert/manualTrigger/{id}:
//  *   post:
//  *     summary: Manually trigger a price alert
//  *     description: Manually trigger a price alert by its ID.
//  *     tags:
//  *       - Price Alerts
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The price alert ID
//  *     responses:
//  *       200:
//  *         description: Price alert triggered manually.
//  *       404:
//  *         description: Price alert not found.
//  *     security:
//  *       - bearerAuth: []
//  */
// //router.post('/manualTrigger/:id', authenticateUser, manualTrigger);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');

const {
    createPriceAlert,
    getPriceAlerts,
    deletePriceAlert,
    updatePriceAlert,
    manualTrigger,
} = require('../controllers/priceAlertController');

/**
 * @swagger
 * tags:
 *   name: Price Alerts
 *   description: Manage price alerts for stock symbols
 */

/**
 * @swagger
 * /priceAlert:
 *   post:
 *     summary: Create a new price alert
 *     description: Create a price alert for a specific stock symbol.
 *     tags:
 *       - Price Alerts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               symbol:
 *                 type: string
 *                 description: Stock symbol for the alert (e.g., AAPL, TSLA).
 *               priceLevel:
 *                 type: number
 *                 description: Price threshold to trigger the alert.
 *               condition:
 *                 type: string
 *                 enum: [above, below]
 *                 description: Condition to trigger the alert (above or below the price level).
 *               userEmail:
 *                 type: string
 *                 description: User's email for notifications.
 *     responses:
 *       201:
 *         description: Price alert created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 id: "64acdffz88d336e8a8"
 *                 symbol: "AAPL"
 *                 priceLevel: 150
 *                 condition: "above"
 *                 isActive: true
 *                 hasTriggered: false
 *       400:
 *         description: Invalid input.
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticateUser, createPriceAlert);

/**
 * @swagger
 * /priceAlert:
 *   get:
 *     summary: Get all price alerts for the authenticated user
 *     description: Retrieve all price alerts associated with the authenticated user.
 *     tags:
 *       - Price Alerts
 *     responses:
 *       200:
 *         description: A list of price alerts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   symbol:
 *                     type: string
 *                   priceLevel:
 *                     type: number
 *                   condition:
 *                     type: string
 *                     enum: [above, below]
 *                   isActive:
 *                     type: boolean
 *                   hasTriggered:
 *                     type: boolean
 *               example:
 *                 - id: "64acdffz88d336e8a8"
 *                   symbol: "AAPL"
 *                   priceLevel: 150
 *                   condition: "above"
 *                   isActive: true
 *                   hasTriggered: false
 *                 - id: "64ab78f98e478fa234"
 *                   symbol: "TSLA"
 *                   priceLevel: 700
 *                   condition: "below"
 *                   isActive: false
 *                   hasTriggered: true
 *       401:
 *         description: Unauthorized access.
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authenticateUser, getPriceAlerts);

/**
 * @swagger
 * /priceAlert/{id}:
 *   delete:
 *     summary: Delete a price alert
 *     description: Delete a specific price alert by its ID for the authenticated user.
 *     tags:
 *       - Price Alerts
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The price alert ID
 *     responses:
 *       200:
 *         description: Price alert deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Price alert deleted successfully."
 *       404:
 *         description: Price alert not found.
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticateUser, deletePriceAlert);

/**
 * @swagger
 * /priceAlert/{id}:
 *   put:
 *     summary: Update a price alert
 *     description: Update a specific price alert by its ID for the authenticated user.
 *     tags:
 *       - Price Alerts
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The price alert ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               priceLevel:
 *                 type: number
 *               condition:
 *                 type: string
 *                 enum: [above, below]
 *     responses:
 *       200:
 *         description: Price alert updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 id: "64acdffz88d336e8a8"
 *                 symbol: "AAPL"
 *                 priceLevel: 160
 *                 condition: "below"
 *                 isActive: true
 *                 hasTriggered: false
 *       404:
 *         description: Price alert not found.
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticateUser, updatePriceAlert);

/**
 * @swagger
 * /priceAlert/manualTrigger/{id}:
 *   post:
 *     summary: Manually trigger a price alert
 *     description: Manually trigger a price alert by its ID.
 *     tags:
 *       - Price Alerts
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The price alert ID
 *     responses:
 *       200:
 *         description: Price alert triggered manually.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Price alert triggered successfully."
 *       404:
 *         description: Price alert not found.
 *     security:
 *       - bearerAuth: []
 */
//router.post('/manualTrigger/:id', authenticateUser, manualTrigger);

module.exports = router;
