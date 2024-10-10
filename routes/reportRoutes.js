// const express = require('express');
// const router = express.Router();
// const { authenticateUser } = require('../middleware/authentication');
// const { 
//     getAllReports, 
//     getAccountReport, 
//     createCustomReport,
//     deleteReport,
// } = require('../controllers/reportController');

// router.get('/', authenticateUser, getAllReports);
// router.delete('/:id', authenticateUser, deleteReport);
// router.get('/account/:accountId', authenticateUser, getAccountReport);
// router.post('/custom', authenticateUser, createCustomReport);

// module.exports = router;



// const express = require('express');
// const router = express.Router();
// const { authenticateUser } = require('../middleware/authentication');

// const {
//     getAllReports,
//     getAccountReport,
//     createCustomReport,
//     deleteReport,
// } = require('../controllers/reportController');

// /**
//  * @swagger
//  * tags:
//  *   name: Reports
//  *   description: Routes for managing and generating reports. Reports are automatically emailed to the user upon creation.
//  */

// /**
//  * @swagger
//  * /reports:
//  *   get:
//  *     summary: Get all reports
//  *     description: Retrieve all reports available for the authenticated user. Reports are sent via email to the user's registered email address.
//  *     tags:
//  *       - Reports
//  *     responses:
//  *       200:
//  *         description: A list of reports with metadata.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   id:
//  *                     type: string
//  *                     description: The report ID.
//  *                   accountId:
//  *                     type: string
//  *                     description: The ID of the account associated with the report.
//  *                   period:
//  *                     type: string
//  *                     description: The report period (e.g., daily, weekly, monthly, custom).
//  *                   date:
//  *                     type: string
//  *                     format: date
//  *                     description: The date of the report.
//  *                   data:
//  *                     type: object
//  *                     description: The report data, including net profit/loss and trade statistics.
//  *                     properties:
//  *                       netPnL:
//  *                         type: number
//  *                         description: Net profit and loss of the report period.
//  *                       totalTrades:
//  *                         type: number
//  *                         description: Total number of trades in the report period.
//  *                       totalFees:
//  *                         type: number
//  *                         description: Total fees for the trades in the report period.
//  *                       winningTradePercent:
//  *                         type: number
//  *                         description: Percentage of winning trades.
//  *                   createdAt:
//  *                     type: string
//  *                     format: date-time
//  *                     description: The date and time the report was created.
//  *       401:
//  *         description: Unauthorized access.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.get('/', authenticateUser, getAllReports);

// /**
//  * @swagger
//  * /reports/{id}:
//  *   delete:
//  *     summary: Delete a report
//  *     description: Delete a specific report by its ID.
//  *     tags:
//  *       - Reports
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The report ID
//  *     responses:
//  *       200:
//  *         description: Report deleted successfully.
//  *       404:
//  *         description: Report not found.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.delete('/:id', authenticateUser, deleteReport);

// /**
//  * @swagger
//  * /reports/account/{accountId}:
//  *   get:
//  *     summary: Get report for a specific account
//  *     description: Retrieve a report for a specific account using the account ID. The report will be sent via email to the authenticated user.
//  *     tags:
//  *       - Reports
//  *     parameters:
//  *       - in: path
//  *         name: accountId
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The account ID
//  *     responses:
//  *       200:
//  *         description: Report for the specified account retrieved successfully and sent to the user via email.
//  *       404:
//  *         description: Account not found.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.get('/account/:accountId', authenticateUser, getAccountReport);

// /**
//  * @swagger
//  * /reports/custom:
//  *   post:
//  *     summary: Create a custom report
//  *     description: Generate a custom report based on specific criteria provided by the authenticated user. The report will be sent via email to the user.
//  *     tags:
//  *       - Reports
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               accountId:
//  *                 type: string
//  *                 description: The account ID for which the report is generated.
//  *               reportType:
//  *                 type: string
//  *                 description: The type of report (e.g., performance, transaction history).
//  *               startDate:
//  *                 type: string
//  *                 format: date
//  *                 description: The start date for the custom report.
//  *               endDate:
//  *                 type: string
//  *                 format: date
//  *                 description: The end date for the custom report.
//  *     responses:
//  *       201:
//  *         description: Custom report created successfully and sent via email.
//  *       400:
//  *         description: Invalid input.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.post('/custom', authenticateUser, createCustomReport);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');

const {
    getAllReports,
    getAccountReport,
    createCustomReport,
    deleteReport,
} = require('../controllers/reportController');

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Routes for managing and generating reports. Reports are automatically emailed to the user upon creation.
 */

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Get all reports
 *     description: Retrieve all reports available for the authenticated user. Reports are sent via email to the user's registered email address.
 *     tags:
 *       - Reports
 *     responses:
 *       200:
 *         description: A list of reports with metadata.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The report ID.
 *                   accountId:
 *                     type: string
 *                     description: The ID of the account associated with the report.
 *                   period:
 *                     type: string
 *                     description: The report period (e.g., daily, weekly, monthly, custom).
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date of the report.
 *                   data:
 *                     type: object
 *                     description: The report data, including net profit/loss and trade statistics.
 *                     properties:
 *                       netPnL:
 *                         type: number
 *                         description: Net profit and loss of the report period.
 *                       totalTrades:
 *                         type: number
 *                         description: Total number of trades in the report period.
 *                       totalFees:
 *                         type: number
 *                         description: Total fees for the trades in the report period.
 *                       winningTradePercent:
 *                         type: number
 *                         description: Percentage of winning trades.
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time the report was created.
 *               example:
 *                 - id: "64b8a13e79dabb6a1f"
 *                   accountId: "64b7e1a479dabb1124"
 *                   period: "daily"
 *                   date: "2024-09-10"
 *                   data:
 *                     netPnL: 2500
 *                     totalTrades: 4
 *                     totalFees: 50
 *                     winningTradePercent: 75
 *                   createdAt: "2024-09-11T10:00:00Z"
 *       401:
 *         description: Unauthorized access.
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authenticateUser, getAllReports);

/**
 * @swagger
 * /reports/{id}:
 *   delete:
 *     summary: Delete a report
 *     description: Delete a specific report by its ID.
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The report ID
 *     responses:
 *       200:
 *         description: Report deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Report deleted successfully."
 *       404:
 *         description: Report not found.
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticateUser, deleteReport);

/**
 * @swagger
 * /reports/account/{accountId}:
 *   get:
 *     summary: Get report for a specific account
 *     description: Retrieve a report for a specific account using the account ID. The report will be sent via email to the authenticated user.
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: path
 *         name: accountId
 *         schema:
 *           type: string
 *         required: true
 *         description: The account ID
 *     responses:
 *       200:
 *         description: Report for the specified account retrieved successfully and sent to the user via email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 accountId:
 *                   type: string
 *                 period:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date
 *                 data:
 *                   type: object
 *                   properties:
 *                     netPnL:
 *                       type: number
 *                     totalTrades:
 *                       type: number
 *                     totalFees:
 *                       type: number
 *                     winningTradePercent:
 *                       type: number
 *               example:
 *                 id: "64b8a13e79dabb6a1f"
 *                 accountId: "64b7e1a479dabb1124"
 *                 period: "weekly"
 *                 date: "2024-09-12"
 *                 data:
 *                   netPnL: 4500
 *                   totalTrades: 6
 *                   totalFees: 100
 *                   winningTradePercent: 80
 *       404:
 *         description: Account not found.
 *     security:
 *       - bearerAuth: []
 */
router.get('/account/:accountId', authenticateUser, getAccountReport);

/**
 * @swagger
 * /reports/custom:
 *   post:
 *     summary: Create a custom report
 *     description: Generate a custom report based on specific criteria provided by the authenticated user. The report will be sent via email to the user.
 *     tags:
 *       - Reports
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountId:
 *                 type: string
 *                 description: The account ID for which the report is generated.
 *               reportType:
 *                 type: string
 *                 description: The type of report (e.g., performance, transaction history).
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The start date for the custom report.
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: The end date for the custom report.
 *     responses:
 *       201:
 *         description: Custom report created successfully and sent via email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Custom report created and sent to your email."
 *       400:
 *         description: Invalid input.
 *     security:
 *       - bearerAuth: []
 */
router.post('/custom', authenticateUser, createCustomReport);

module.exports = router;
