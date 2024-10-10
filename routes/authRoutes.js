// const express = require('express');
// const router = express.Router();
// const {authenticateUser} = require('../middleware/authentication');
// const {authrorizePermissions} = require('../middleware/permissions');

// const {
//     registerUser,
//     loginUser,
//     logoutUser,
//     registerUserManager,
//     confirmEmail,
//     recoverPassword,
//     resetPassword,

// } = require('../controllers/authController');

// //admin
// router.post('/registerManager',authenticateUser,authrorizePermissions('admin'),registerUserManager);

// //noPermissons
// router.post('/register',registerUser);
// router.post('/login',loginUser);
// router.get('/logout',logoutUser);

// router.get('/confirm-email', confirmEmail);
// router.post('/recover-password', recoverPassword);
// router.post('/reset-password', resetPassword);

// module.exports = router



// const express = require('express');
// const router = express.Router();
// const { authenticateUser } = require('../middleware/authentication');
// const { authrorizePermissions } = require('../middleware/permissions');

// const {
//     registerUser,
//     loginUser,
//     logoutUser,
//     registerUserManager,
//     confirmEmail,
//     recoverPassword,
//     resetPassword,
// } = require('../controllers/authController');

// /**
//  * @swagger
//  * tags:
//  *   name: Auth
//  *   description: Authentication routes
//  */

// /**
//  * @swagger
//  * /auth/registerManager:
//  *   post:
//  *     summary: Register a new manager (admin only)
//  *     description: Create a new user account with manager permissions.
//  *     tags:
//  *       - Auth
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *               name:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: Manager registered successfully.
//  *       400:
//  *         description: Invalid input or user already exists.
//  *     security:
//  *       - bearerAuth: []  # JWT authentication required
//  */
// router.post('/registerManager', authenticateUser, authrorizePermissions('admin'), registerUserManager);

// /**
//  * @swagger
//  * /auth/register:
//  *   post:
//  *     summary: Register a new user
//  *     description: Create a new user account with an email and password.
//  *     tags:
//  *       - Auth
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *               username:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: User registered successfully.
//  *       400:
//  *         description: Invalid input or user already exists.
//  */
// router.post('/register', registerUser);

// /**
//  * @swagger
//  * /auth/login:
//  *   post:
//  *     summary: User login
//  *     description: Authenticate a user with an email and password.
//  *     tags:
//  *       - Auth
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: User logged in successfully.
//  *       401:
//  *         description: Invalid credentials.
//  */
// router.post('/login', loginUser);

// /**
//  * @swagger
//  * /auth/logout:
//  *   get:
//  *     summary: Logout the user
//  *     description: Logout the authenticated user and clear the session.
//  *     tags:
//  *       - Auth
//  *     responses:
//  *       200:
//  *         description: User logged out successfully.
//  *     security:
//  *       - bearerAuth: []  # JWT authentication required
//  */
// router.get('/logout', logoutUser);

// /**
//  * @swagger
//  * /auth/confirm-email:
//  *   get:
//  *     summary: Confirm user's email
//  *     description: Confirm the email address of a user after registration.
//  *     tags:
//  *       - Auth
//  *     parameters:
//  *       - in: query
//  *         name: token
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: Email confirmation token
//  *     responses:
//  *       200:
//  *         description: Email confirmed successfully.
//  *       400:
//  *         description: Invalid or expired token.
//  */
// router.get('/confirm-email', confirmEmail);

// /**
//  * @swagger
//  * /auth/recover-password:
//  *   post:
//  *     summary: Recover password
//  *     description: Send an email to recover a user's password.
//  *     tags:
//  *       - Auth
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Password recovery email sent.
//  *       404:
//  *         description: User not found.
//  */
// router.post('/recover-password', recoverPassword);

// /**
//  * @swagger
//  * /auth/reset-password:
//  *   post:
//  *     summary: Reset user's password
//  *     description: Reset the user's password using a token sent to the user's email.
//  *     tags:
//  *       - Auth
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               token:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Password reset successfully.
//  *       400:
//  *         description: Invalid or expired token.
//  */
// router.post('/reset-password', resetPassword);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const { authrorizePermissions } = require('../middleware/permissions');

const {
    registerUser,
    loginUser,
    logoutUser,
    registerUserManager,
    confirmEmail,
    recoverPassword,
    resetPassword,
} = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */

/**
 * @swagger
 * /auth/registerManager:
 *   post:
 *     summary: Register a new manager (admin only)
 *     description: Create a new user account with manager permissions.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       201:
 *         description: Manager registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 id: "649f1b2e1f1f1b6f1f1f1f1f"
 *                 email: "manager@example.com"
 *                 username: "ManagerUser"
 *                 role: "manager"
 *                 isActive: true
 *       400:
 *         description: Invalid input or user already exists.
 *     security:
 *       - bearerAuth: []
 */
router.post('/registerManager', authenticateUser, authrorizePermissions('admin'), registerUserManager);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with an email and password.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 id: "649f1b2e1f1f1b6f1f1f1f1f"
 *                 email: "user@example.com"
 *                 username: "NewUser"
 *                 role: "user"
 *                 isActive: true
 *       400:
 *         description: Invalid input or user already exists.
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user with an email and password.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid credentials.
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout the user
 *     description: Logout the authenticated user and clear the session.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: User logged out successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "User logged out successfully."
 *     security:
 *       - bearerAuth: []
 */
router.get('/logout', logoutUser);

/**
 * @swagger
 * /auth/confirm-email:
 *   get:
 *     summary: Confirm user's email
 *     description: Confirm the email address of a user after registration.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Email confirmation token
 *     responses:
 *       200:
 *         description: Email confirmed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Email confirmed successfully."
 *       400:
 *         description: Invalid or expired token.
 */
router.get('/confirm-email', confirmEmail);

/**
 * @swagger
 * /auth/recover-password:
 *   post:
 *     summary: Recover password
 *     description: Send an email to recover a user's password.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password recovery email sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Password recovery email sent."
 *       404:
 *         description: User not found.
 */
router.post('/recover-password', recoverPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user's password
 *     description: Reset the user's password using a token sent to the user's email.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Password reset successfully."
 *       400:
 *         description: Invalid or expired token.
 */
router.post('/reset-password', resetPassword);

module.exports = router;
