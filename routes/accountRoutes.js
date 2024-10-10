// const express = require('express')
// const router = express.Router()
// const { authenticateUser } = require('../middleware/authentication')
// const { authrorizePermissions } = require('../middleware/permissions')

// const {

//     createAccount,
//     getAllAccountsUser,
//     getAccount,
//     updateAccount,
//     deleteAccount,
//     getAllAccounts,
//     getAllAccountsManager,
//     accountIsActive,
    

// } = require('../controllers/accountController')



// router.route('/').post(authenticateUser, createAccount) //recheck
// //pick id from cookie
// router.route('/allUserAccounts').get(authenticateUser, getAllAccountsUser)
// //order
// router.route('/all').get(authenticateUser, authrorizePermissions('admin'), getAllAccounts)
// router.route('/manager/accounts').get(authenticateUser, authrorizePermissions('manager'), getAllAccountsManager)
// router.route('/:id')
//     .get(authenticateUser, getAccount)
//     .patch(authenticateUser, updateAccount)

// router.route('/:id').delete(authenticateUser, authrorizePermissions('admin'), deleteAccount);

// router.route('/:id/status').patch(authenticateUser,authrorizePermissions('admin'), accountIsActive);








// module.exports = router

// const express = require('express');
// const router = express.Router();
// const { authenticateUser } = require('../middleware/authentication');
// const { authrorizePermissions } = require('../middleware/permissions');

// const {
//     createAccount,
//     getAllAccountsUser,
//     getAccount,
//     updateAccount,
//     deleteAccount,
//     getAllAccounts,
//     getAllAccountsManager,
//     accountIsActive,
// } = require('../controllers/accountController');

// /**
//  * @swagger
//  * tags:
//  *   name: Accounts
//  *   description: Account management routes
//  */

// /**
//  * @swagger
//  * /accounts:
//  *   post:
//  *     summary: Create a new account
//  *     description: Create a new account for the authenticated user.
//  *     tags:
//  *       - Accounts
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               accountName:
//  *                 type: string
//  *               initialBalance:
//  *                 type: number
//  *     responses:
//  *       201:
//  *         description: Account created successfully.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 id:
//  *                   type: string
//  *                 accountName:
//  *                   type: string
//  *                 initialBalance:
//  *                   type: number
//  *                 currentBalance:
//  *                   type: number
//  *                 isActive:
//  *                   type: boolean
//  *                 emailReport:
//  *                   type: boolean
//  *                 createdAt:
//  *                   type: string
//  *                   format: date-time
//  *                 updatedAt:
//  *                   type: string
//  *                   format: date-time
//  *       400:
//  *         description: Invalid input.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.route('/').post(authenticateUser, createAccount);

// /**
//  * @swagger
//  * /accounts/allUserAccounts:
//  *   get:
//  *     summary: Get all accounts for the authenticated user
//  *     description: Retrieve all accounts associated with the authenticated user.
//  *     tags:
//  *       - Accounts
//  *     responses:
//  *       200:
//  *         description: A list of accounts.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   id:
//  *                     type: string
//  *                   accountName:
//  *                     type: string
//  *                   initialBalance:
//  *                     type: number
//  *                   currentBalance:
//  *                     type: number
//  *                   isActive:
//  *                     type: boolean
//  *                   emailReport:
//  *                     type: boolean
//  *                   createdAt:
//  *                     type: string
//  *                     format: date-time
//  *                   updatedAt:
//  *                     type: string
//  *                     format: date-time
//  *       401:
//  *         description: Unauthorized access.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.route('/allUserAccounts').get(authenticateUser, getAllAccountsUser);

// /**
//  * @swagger
//  * /accounts/all:
//  *   get:
//  *     summary: Get all accounts (admin only)
//  *     description: Retrieve all accounts (admin access only).
//  *     tags:
//  *       - Accounts
//  *     responses:
//  *       200:
//  *         description: A list of all accounts.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   id:
//  *                     type: string
//  *                   accountName:
//  *                     type: string
//  *                   initialBalance:
//  *                     type: number
//  *                   currentBalance:
//  *                     type: number
//  *                   isActive:
//  *                     type: boolean
//  *                   emailReport:
//  *                     type: boolean
//  *                   createdAt:
//  *                     type: string
//  *                     format: date-time
//  *                   updatedAt:
//  *                     type: string
//  *                     format: date-time
//  *       403:
//  *         description: Forbidden. Only admin users can access this endpoint.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.route('/all').get(authenticateUser, authrorizePermissions('admin'), getAllAccounts);

// /**
//  * @swagger
//  * /accounts/manager/accounts:
//  *   get:
//  *     summary: Get accounts managed by the manager
//  *     description: Retrieve all accounts managed by the authenticated manager.
//  *     tags:
//  *       - Accounts
//  *     responses:
//  *       200:
//  *         description: A list of managed accounts.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   id:
//  *                     type: string
//  *                   accountName:
//  *                     type: string
//  *                   initialBalance:
//  *                     type: number
//  *                   currentBalance:
//  *                     type: number
//  *                   isActive:
//  *                     type: boolean
//  *                   emailReport:
//  *                     type: boolean
//  *                   createdAt:
//  *                     type: string
//  *                     format: date-time
//  *                   updatedAt:
//  *                     type: string
//  *                     format: date-time
//  *       403:
//  *         description: Forbidden. Only managers can access this endpoint.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.route('/manager/accounts').get(authenticateUser, authrorizePermissions('manager'), getAllAccountsManager);

// /**
//  * @swagger
//  * /accounts/{id}:
//  *   get:
//  *     summary: Get a specific account by ID
//  *     description: Retrieve an account by its ID for the authenticated user.
//  *     tags:
//  *       - Accounts
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The account ID
//  *     responses:
//  *       200:
//  *         description: The account data.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 id:
//  *                   type: string
//  *                 accountName:
//  *                   type: string
//  *                 initialBalance:
//  *                   type: number
//  *                 currentBalance:
//  *                   type: number
//  *                 isActive:
//  *                   type: boolean
//  *                 emailReport:
//  *                   type: boolean
//  *                 createdAt:
//  *                   type: string
//  *                   format: date-time
//  *                 updatedAt:
//  *                   type: string
//  *                   format: date-time
//  *       404:
//  *         description: Account not found.
//  *     security:
//  *       - bearerAuth: []
//  */
// router
//     .route('/:id')
//     .get(authenticateUser, getAccount)
    

// /**
//  * @swagger
//  * /accounts/{id}:
//  *   patch:
//  *     summary: Update an account
//  *     description: Update the details of an account by its ID.
//  *     tags:
//  *       - Accounts
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The account ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               accountName:
//  *                 type: string
//  *               currentBalance:
//  *                 type: number
//  *               isActive:
//  *                 type: boolean
//  *               emailReport:
//  *                 type: boolean
//  *     responses:
//  *       200:
//  *         description: Account updated successfully.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 id:
//  *                   type: string
//  *                 accountName:
//  *                   type: string
//  *                 currentBalance:
//  *                   type: number
//  *                 isActive:
//  *                   type: boolean
//  *                 emailReport:
//  *                   type: boolean
//  *                 createdAt:
//  *                   type: string
//  *                   format: date-time
//  *                 updatedAt:
//  *                   type: string
//  *                   format: date-time
//  *       404:
//  *         description: Account not found.
//  *       400:
//  *         description: Invalid input.
//  *     security:
//  *       - bearerAuth: []
//  */
// router
//     .route('/:id')
//     .patch(authenticateUser, updateAccount);

// /**
//  * @swagger
//  * /accounts/{id}:
//  *   delete:
//  *     summary: Delete an account (admin only)
//  *     description: Delete an account by its ID for the authenticated user (admin access only).
//  *     tags:
//  *       - Accounts
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The account ID
//  *     responses:
//  *       200:
//  *         description: Account deleted successfully.
//  *       404:
//  *         description: Account not found.
//  *       403:
//  *         description: Forbidden. Only admin users can delete accounts.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.route('/:id').delete(authenticateUser, authrorizePermissions('admin'), deleteAccount);

// /**
//  * @swagger
//  * /accounts/{id}/status:
//  *   patch:
//  *     summary: Update account status (admin only)
//  *     description: Update the active status of an account by its ID (admin access only).
//  *     tags:
//  *       - Accounts
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The account ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               isActive:
//  *                 type: boolean
//  *     responses:
//  *       200:
//  *         description: Account status updated successfully.
//  *       404:
//  *         description: Account not found.
//  *       403:
//  *         description: Forbidden. Only admin users can update account status.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.route('/:id/status').patch(authenticateUser, authrorizePermissions('admin'), accountIsActive);

// module.exports = router



const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const { authrorizePermissions } = require('../middleware/permissions');

const {
    createAccount,
    getAllAccountsUser,
    getAccount,
    updateAccount,
    deleteAccount,
    getAllAccounts,
    getAllAccountsManager,
    accountIsActive,
} = require('../controllers/accountController');

/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: Account management routes
 */

/**
 * @swagger
 * /accounts:
 *   post:
 *     summary: Create a new account
 *     description: Create a new account for the authenticated user.
 *     tags:
 *       - Accounts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountName:
 *                 type: string
 *               initialBalance:
 *                 type: number
 *     responses:
 *       201:
 *         description: Account created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 accountName: "Trading Account"
 *                 initialBalance: 10000
 *                 currentBalance: 10000
 *                 isActive: true
 *                 emailReport: false
 *       400:
 *         description: Invalid input.
 *     security:
 *       - bearerAuth: []
 */
router.route('/').post(authenticateUser, createAccount);

/**
 * @swagger
 * /accounts/allUserAccounts:
 *   get:
 *     summary: Get all accounts for the authenticated user
 *     description: Retrieve all accounts associated with the authenticated user.
 *     tags:
 *       - Accounts
 *     responses:
 *       200:
 *         description: A list of accounts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   accountName:
 *                     type: string
 *                   initialBalance:
 *                     type: number
 *                   currentBalance:
 *                     type: number
 *                   isActive:
 *                     type: boolean
 *                   emailReport:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized access.
 *     security:
 *       - bearerAuth: []
 */
router.route('/allUserAccounts').get(authenticateUser, getAllAccountsUser);

/**
 * @swagger
 * /accounts/all:
 *   get:
 *     summary: Get all accounts (admin only)
 *     description: Retrieve all accounts (admin access only).
 *     tags:
 *       - Accounts
 *     responses:
 *       200:
 *         description: A list of all accounts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   accountName:
 *                     type: string
 *                   initialBalance:
 *                     type: number
 *                   currentBalance:
 *                     type: number
 *                   isActive:
 *                     type: boolean
 *                   emailReport:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       403:
 *         description: Forbidden. Only admin users can access this endpoint.
 *     security:
 *       - bearerAuth: []
 */
router.route('/all').get(authenticateUser, authrorizePermissions('admin'), getAllAccounts);

/**
 * @swagger
 * /accounts/manager/accounts:
 *   get:
 *     summary: Get accounts managed by the manager
 *     description: Retrieve all accounts managed by the authenticated manager.
 *     tags:
 *       - Accounts
 *     responses:
 *       200:
 *         description: A list of managed accounts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   accountName:
 *                     type: string
 *                   initialBalance:
 *                     type: number
 *                   currentBalance:
 *                     type: number
 *                   isActive:
 *                     type: boolean
 *                   emailReport:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       403:
 *         description: Forbidden. Only managers can access this endpoint.
 *     security:
 *       - bearerAuth: []
 */
router.route('/manager/accounts').get(authenticateUser, authrorizePermissions('manager'), getAllAccountsManager);

/**
 * @swagger
 * /accounts/{id}:
 *   get:
 *     summary: Get a specific account by ID
 *     description: Retrieve an account by its ID for the authenticated user.
 *     tags:
 *       - Accounts
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The account ID
 *     responses:
 *       200:
 *         description: The account data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 accountName:
 *                   type: string
 *                 initialBalance:
 *                   type: number
 *                 currentBalance:
 *                   type: number
 *                 isActive:
 *                   type: boolean
 *                 emailReport:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Account not found.
 *     security:
 *       - bearerAuth: []
 */
router
    .route('/:id')
    .get(authenticateUser, getAccount)
    

/**
 * @swagger
 * /accounts/{id}:
 *   patch:
 *     summary: Update an account
 *     description: Update the details of an account by its ID.
 *     tags:
 *       - Accounts
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The account ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountName:
 *                 type: string
 *               currentBalance:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *               emailReport:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Account updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 accountName:
 *                   type: string
 *                 currentBalance:
 *                   type: number
 *                 isActive:
 *                   type: boolean
 *                 emailReport:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Account not found.
 *       400:
 *         description: Invalid input.
 *     security:
 *       - bearerAuth: []
 */
router
    .route('/:id')
    .patch(authenticateUser, updateAccount);

/**
 * @swagger
 * /accounts/{id}:
 *   delete:
 *     summary: Delete an account (admin only)
 *     description: Delete an account by its ID for the authenticated user (admin access only).
 *     tags:
 *       - Accounts
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The account ID
 *     responses:
 *       200:
 *         description: Account deleted successfully.
 *       404:
 *         description: Account not found.
 *       403:
 *         description: Forbidden. Only admin users can delete accounts.
 *     security:
 *       - bearerAuth: []
 */
router.route('/:id').delete(authenticateUser, authrorizePermissions('admin'), deleteAccount);

/**
 * @swagger
 * /accounts/{id}/status:
 *   patch:
 *     summary: Update account status (admin only)
 *     description: Update the active status of an account by its ID (admin access only).
 *     tags:
 *       - Accounts
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The account ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Account status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 accountName:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Account not found.
 *       403:
 *         description: Forbidden. Only admin users can update account status.
 *     security:
 *       - bearerAuth: []
 */
router.route('/:id/status').patch(authenticateUser, authrorizePermissions('admin'), accountIsActive);

module.exports = router;
