// const express = require('express')
// const router = express.Router()
// const { authenticateUser } = require('../middleware/authentication')
// const { authrorizePermissions } = require('../middleware/permissions')
// const {fileUploadMiddleware} = require('../middleware/fileUpload');

// const {
//     createTrade,
//     getAllTradesAccount,
//     getTrade,
//     updateTrade,
//     deleteTrade,
//     getAllTrades,
//     uploadTradesExcell,
//     getAllTradeEntryManager,
    
// } = require('../controllers/tradeController')

// //routes

// router.route('/allEntrysAccount/:accountId').get(authenticateUser, getAllTradesAccount)

// router.route('/upload/Excel/:accountId').post(authenticateUser,fileUploadMiddleware, uploadTradesExcell)

// router.route('/all').get(authenticateUser, authrorizePermissions('admin'), getAllTrades)
// router.route('/all/manager/userTrades').get(authenticateUser, authrorizePermissions('manager'), getAllTradeEntryManager)

// router.route('/:id')
//     .post(authenticateUser,createTrade)
//     .get(authenticateUser, getTrade)
//     .patch(authenticateUser,updateTrade)
//     .delete(authenticateUser, deleteTrade)

// module.exports = router

// const express = require('express');
// const router = express.Router();
// const { authenticateUser } = require('../middleware/authentication');
// const { authrorizePermissions } = require('../middleware/permissions');
// const { fileUploadMiddleware } = require('../middleware/fileUpload');

// const {
//     createTrade,
//     getAllTradesAccount,
//     getTrade,
//     updateTrade,
//     deleteTrade,
//     getAllTrades,
//     uploadTradesExcell,
//     getAllTradeEntryManager,
// } = require('../controllers/tradeController');

// /**
//  * @swagger
//  * tags:
//  *   name: Trades
//  *   description: Routes related to trade management
//  */

// /**
//  * @swagger
//  * /trades/allEntrysAccount/{accountId}:
//  *   get:
//  *     summary: Get all trades for a specific account
//  *     description: Retrieve all trade entries for a specific account.
//  *     tags:
//  *       - Trades
//  *     parameters:
//  *       - in: path
//  *         name: accountId
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The ID of the account
//  *     responses:
//  *       200:
//  *         description: A list of trades for the specified account.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   id:
//  *                     type: string
//  *                   tradeType:
//  *                     type: string
//  *                   amount:
//  *                     type: number
//  *       404:
//  *         description: Account not found.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.route('/allEntrysAccount/:accountId').get(authenticateUser, getAllTradesAccount);

// /**
//  * @swagger
//  * /trades/upload/Excel/{accountId}:
//  *   post:
//  *     summary: Upload trades from Excel
//  *     description: Upload trades for a specific account using an Excel file.
//  *     tags:
//  *       - Trades
//  *     parameters:
//  *       - in: path
//  *         name: accountId
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The account ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               file:
//  *                 type: string
//  *                 format: binary
//  *                 description: The Excel file containing the trades
//  *     responses:
//  *       200:
//  *         description: Trades uploaded successfully.
//  *       400:
//  *         description: Invalid file format.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.route('/upload/Excel/:accountId').post(authenticateUser, fileUploadMiddleware, uploadTradesExcell);

// /**
//  * @swagger
//  * /trades/all:
//  *   get:
//  *     summary: Get all trades (admin only)
//  *     description: Retrieve all trades (admin access only).
//  *     tags:
//  *       - Trades
//  *     responses:
//  *       200:
//  *         description: A list of all trades.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   id:
//  *                     type: string
//  *                   tradeType:
//  *                     type: string
//  *                   amount:
//  *                     type: number
//  *       403:
//  *         description: Forbidden. Only admin users can access this endpoint.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.route('/all').get(authenticateUser, authrorizePermissions('admin'), getAllTrades);

// /**
//  * @swagger
//  * /trades/all/manager/userTrades:
//  *   get:
//  *     summary: Get all user trades managed by the manager
//  *     description: Retrieve all user trade entries managed by the authenticated manager.
//  *     tags:
//  *       - Trades
//  *     responses:
//  *       200:
//  *         description: A list of managed user trades.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   id:
//  *                     type: string
//  *                   tradeType:
//  *                     type: string
//  *                   amount:
//  *                     type: number
//  *       403:
//  *         description: Forbidden. Only managers can access this endpoint.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.route('/all/manager/userTrades').get(authenticateUser, authrorizePermissions('manager'), getAllTradeEntryManager);

// /**
//  * @swagger
//  * /trades/{id}:
//  *   post:
//  *     summary: Create a new trade
//  *     description: Create a trade for the authenticated user. You can manually input trade details like the symbol, trade date, entry/exit price, size, and fees. 
//  *                  Use this route to record manual trades. Ensure you provide all required fields, including the trade type, whether it's 'Long' or 'Short'.
//  *     tags:
//  *       - Trades
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The trade ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               symbol:
//  *                 type: string
//  *                 description: The stock symbol for the trade
//  *               tradeDate:
//  *                 type: string
//  *                 format: date
//  *                 description: Date of the trade
//  *               entryPrice:
//  *                 type: number
//  *                 description: Price at which the trade was entered
//  *               exitPrice:
//  *                 type: number
//  *                 description: Price at which the trade was exited
//  *               size:
//  *                 type: number
//  *                 description: Number of shares/contracts
//  *               tradeType:
//  *                 type: string
//  *                 enum: [Short, Long]
//  *                 description: Type of trade
//  *               fees:
//  *                 type: number
//  *                 description: Fees for the trade
//  *     responses:
//  *       201:
//  *         description: Trade created successfully.
//  *       400:
//  *         description: Invalid input.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.post('/:id', authenticateUser, createTrade);

// /**
//  * @swagger
//  * /trades/{id}:
//  *   get:
//  *     summary: Get a specific trade by ID
//  *     description: Retrieve a specific trade by its ID for the authenticated user.
//  *     tags:
//  *       - Trades
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The trade ID
//  *     responses:
//  *       200:
//  *         description: The trade details.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 symbol:
//  *                   type: string
//  *                 tradeDate:
//  *                   type: string
//  *                   format: date
//  *                 entryPrice:
//  *                   type: number
//  *                 exitPrice:
//  *                   type: number
//  *                 size:
//  *                   type: number
//  *                 tradeType:
//  *                   type: string
//  *                 fees:
//  *                   type: number
//  *                 netProfitLoss:
//  *                   type: number
//  *       404:
//  *         description: Trade not found.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.get('/:id', authenticateUser, getTrade);

// /**
//  * @swagger
//  * /trades/{id}:
//  *   patch:
//  *     summary: Update a trade
//  *     description: Update a specific trade by its ID for the authenticated user.
//  *     tags:
//  *       - Trades
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The trade ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               symbol:
//  *                 type: string
//  *               tradeDate:
//  *                 type: string
//  *                 format: date
//  *               entryPrice:
//  *                 type: number
//  *               exitPrice:
//  *                 type: number
//  *               size:
//  *                 type: number
//  *               tradeType:
//  *                 type: string
//  *               fees:
//  *                 type: number
//  *     responses:
//  *       200:
//  *         description: Trade updated successfully.
//  *       404:
//  *         description: Trade not found.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.patch('/:id', authenticateUser, updateTrade);

// /**
//  * @swagger
//  * /trades/{id}:
//  *   delete:
//  *     summary: Delete a trade
//  *     description: Delete a specific trade by its ID for the authenticated user.
//  *     tags:
//  *       - Trades
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The trade ID
//  *     responses:
//  *       200:
//  *         description: Trade deleted successfully.
//  *       404:
//  *         description: Trade not found.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.delete('/:id', authenticateUser, deleteTrade);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const { authrorizePermissions } = require('../middleware/permissions');
const { fileUploadMiddleware } = require('../middleware/fileUpload');

const {
    createTrade,
    getAllTradesAccount,
    getTrade,
    updateTrade,
    deleteTrade,
    getAllTrades,
    uploadTradesExcell,
    getAllTradeEntryManager,
} = require('../controllers/tradeController');

/**
 * @swagger
 * tags:
 *   name: Trades
 *   description: Routes related to trade management
 */

/**
 * @swagger
 * /trades/allEntrysAccount/{accountId}:
 *   get:
 *     summary: Get all trades for a specific account
 *     description: Retrieve all trade entries for a specific account.
 *     tags:
 *       - Trades
 *     parameters:
 *       - in: path
 *         name: accountId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the account
 *     responses:
 *       200:
 *         description: A list of trades for the specified account.
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
 *                   tradeDate:
 *                     type: string
 *                     format: date
 *                   entryPrice:
 *                     type: number
 *                   exitPrice:
 *                     type: number
 *                   size:
 *                     type: number
 *                   tradeType:
 *                     type: string
 *                   fees:
 *                     type: number
 *                   netProfitLoss:
 *                     type: number
 *               example:
 *                 id: "64f8c29e79dabb92f3"
 *                 symbol: "AAPL"
 *                 tradeDate: "2024-08-11"
 *                 entryPrice: 140.50
 *                 exitPrice: 150.30
 *                 size: 100
 *                 tradeType: "Long"
 *                 fees: 10
 *                 netProfitLoss: 980
 *       404:
 *         description: Account not found.
 *     security:
 *       - bearerAuth: []
 */
router.route('/allEntrysAccount/:accountId').get(authenticateUser, getAllTradesAccount);

/**
 * @swagger
 * /trades/upload/Excel/{accountId}:
 *   post:
 *     summary: Upload trades from Excel
 *     description: Upload trades for a specific account using an Excel file.
 *     tags:
 *       - Trades
 *     parameters:
 *       - in: path
 *         name: accountId
 *         schema:
 *           type: string
 *         required: true
 *         description: The account ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The Excel file containing the trades
 *     responses:
 *       200:
 *         description: Trades uploaded successfully.
 *       400:
 *         description: Invalid file format.
 *     security:
 *       - bearerAuth: []
 */
router.route('/upload/Excel/:accountId').post(authenticateUser, fileUploadMiddleware, uploadTradesExcell);

/**
 * @swagger
 * /trades/all:
 *   get:
 *     summary: Get all trades (admin only)
 *     description: Retrieve all trades (admin access only).
 *     tags:
 *       - Trades
 *     responses:
 *       200:
 *         description: A list of all trades.
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
 *                   tradeDate:
 *                     type: string
 *                     format: date
 *                   entryPrice:
 *                     type: number
 *                   exitPrice:
 *                     type: number
 *                   size:
 *                     type: number
 *                   tradeType:
 *                     type: string
 *                   fees:
 *                     type: number
 *                   netProfitLoss:
 *                     type: number
 *               example:
 *                 id: "64f8c29e79dabb92f3"
 *                 symbol: "AAPL"
 *                 tradeDate: "2024-08-11"
 *                 entryPrice: 140.50
 *                 exitPrice: 150.30
 *                 size: 100
 *                 tradeType: "Long"
 *                 fees: 10
 *                 netProfitLoss: 980
 *       403:
 *         description: Forbidden. Only admin users can access this endpoint.
 *     security:
 *       - bearerAuth: []
 */
router.route('/all').get(authenticateUser, authrorizePermissions('admin'), getAllTrades);

/**
 * @swagger
 * /trades/all/manager/userTrades:
 *   get:
 *     summary: Get all user trades managed by the manager
 *     description: Retrieve all user trade entries managed by the authenticated manager.
 *     tags:
 *       - Trades
 *     responses:
 *       200:
 *         description: A list of managed user trades.
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
 *                   tradeDate:
 *                     type: string
 *                     format: date
 *                   entryPrice:
 *                     type: number
 *                   exitPrice:
 *                     type: number
 *                   size:
 *                     type: number
 *                   tradeType:
 *                     type: string
 *                   fees:
 *                     type: number
 *                   netProfitLoss:
 *                     type: number
 *               example:
 *                 id: "64f8c29e79dabb92f3"
 *                 symbol: "GOOG"
 *                 tradeDate: "2024-09-05"
 *                 entryPrice: 2500.00
 *                 exitPrice: 2600.00
 *                 size: 50
 *                 tradeType: "Long"
 *                 fees: 50
 *                 netProfitLoss: 4900
 *       403:
 *         description: Forbidden. Only managers can access this endpoint.
 *     security:
 *       - bearerAuth: []
 */
router.route('/all/manager/userTrades').get(authenticateUser, authrorizePermissions('manager'), getAllTradeEntryManager);

/**
 * @swagger
 * /trades/{id}:
 *   post:
 *     summary: Create a new trade
 *     description: Create a trade for the authenticated user. You can manually input trade details like the symbol, trade date, entry/exit price, size, and fees.
 *                  Use this route to record manual trades. Ensure you provide all required fields, including the trade type, whether it's 'Long' or 'Short'.
 *     tags:
 *       - Trades
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The trade ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               symbol:
 *                 type: string
 *                 description: The stock symbol for the trade
 *               tradeDate:
 *                 type: string
 *                 format: date
 *                 description: Date of the trade
 *               entryPrice:
 *                 type: number
 *                 description: Price at which the trade was entered
 *               exitPrice:
 *                 type: number
 *                 description: Price at which the trade was exited
 *               size:
 *                 type: number
 *                 description: Number of shares/contracts
 *               tradeType:
 *                 type: string
 *                 enum: [Short, Long]
 *                 description: Type of trade
 *               fees:
 *                 type: number
 *                 description: Fees for the trade
 *     responses:
 *       201:
 *         description: Trade created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 symbol:
 *                   type: string
 *                 tradeDate:
 *                   type: string
 *                   format: date
 *                 entryPrice:
 *                   type: number
 *                 exitPrice:
 *                   type: number
 *                 size:
 *                   type: number
 *                 tradeType:
 *                   type: string
 *                 fees:
 *                   type: number
 *                 netProfitLoss:
 *                   type: number
 *               example:
 *                 id: "64f8c29e79dabb92f3"
 *                 symbol: "AAPL"
 *                 tradeDate: "2024-08-11"
 *                 entryPrice: 140.50
 *                 exitPrice: 150.30
 *                 size: 100
 *                 tradeType: "Long"
 *                 fees: 10
 *                 netProfitLoss: 980
 *       400:
 *         description: Invalid input.
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id', authenticateUser, createTrade);

/**
 * @swagger
 * /trades/{id}:
 *   get:
 *     summary: Get a specific trade by ID
 *     description: Retrieve a specific trade by its ID for the authenticated user.
 *     tags:
 *       - Trades
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The trade ID
 *     responses:
 *       200:
 *         description: The trade details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 symbol:
 *                   type: string
 *                 tradeDate:
 *                   type: string
 *                   format: date
 *                 entryPrice:
 *                   type: number
 *                 exitPrice:
 *                   type: number
 *                 size:
 *                   type: number
 *                 tradeType:
 *                   type: string
 *                 fees:
 *                   type: number
 *                 netProfitLoss:
 *                   type: number
 *               example:
 *                 symbol: "AAPL"
 *                 tradeDate: "2024-08-11"
 *                 entryPrice: 140.50
 *                 exitPrice: 150.30
 *                 size: 100
 *                 tradeType: "Long"
 *                 fees: 10
 *                 netProfitLoss: 980
 *       404:
 *         description: Trade not found.
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', authenticateUser, getTrade);

/**
 * @swagger
 * /trades/{id}:
 *   patch:
 *     summary: Update a trade
 *     description: Update a specific trade by its ID for the authenticated user.
 *     tags:
 *       - Trades
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The trade ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               symbol:
 *                 type: string
 *               tradeDate:
 *                 type: string
 *                 format: date
 *               entryPrice:
 *                 type: number
 *               exitPrice:
 *                 type: number
 *               size:
 *                 type: number
 *               tradeType:
 *                 type: string
 *               fees:
 *                 type: number
 *     responses:
 *       200:
 *         description: Trade updated successfully.
 *       404:
 *         description: Trade not found.
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id', authenticateUser, updateTrade);

/**
 * @swagger
 * /trades/{id}:
 *   delete:
 *     summary: Delete a trade
 *     description: Delete a specific trade by its ID for the authenticated user.
 *     tags:
 *       - Trades
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The trade ID
 *     responses:
 *       200:
 *         description: Trade deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Trade deleted successfully."
 *       404:
 *         description: Trade not found.
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticateUser, deleteTrade);

module.exports = router;
