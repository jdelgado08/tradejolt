// const express = require('express')
// const router = express.Router()
// const {authenticateUser} = require('../middleware/authentication')
// const {authrorizePermissions} = require('../middleware/permissions')

// const {
//     getAllUsers,
//     getUser,
//     showUser,
//     updateUser,
//     updateUserPassword,
//     updateUserToManager,
//     getManager,
//     deleteUser,
//     getAllUsersManager,
//     selfDeactivate,
//     activateUser,
//     deactivateUser,


// } = require('../controllers/userController')

// //admin routes
// router.route('/').get(authenticateUser, authrorizePermissions('admin') ,getAllUsers)
// router.route('/updateUserToManager').patch(authenticateUser, authrorizePermissions('admin') ,updateUserToManager)
// router.route('/:id').delete(authenticateUser,authrorizePermissions('admin'),deleteUser)

// router.route('/manager/users').get(authenticateUser, authrorizePermissions('manager') ,getAllUsersManager)

// //user routes
// router.route('/showMe').get(authenticateUser, showUser)
// router.route('/updateUser').patch(authenticateUser, updateUser)
// router.route('/updateUserPassword').patch(authenticateUser,updateUserPassword)
// router.route('/getManager').get(authenticateUser,getManager)

// router.route('/:id').get(authenticateUser,getUser);

// router.route('/:id/activate').patch(authenticateUser,authrorizePermissions('admin'),activateUser);
// router.route('/:id/deactivate').patch(authenticateUser,deactivateUser);
// router.route('/selfDeactivate').patch(authenticateUser,selfDeactivate);




// module.exports = router

// const express = require('express');
// const router = express.Router();
// const { authenticateUser } = require('../middleware/authentication');
// const { authrorizePermissions } = require('../middleware/permissions');

// const {
//     getAllUsers,
//     getUser,
//     showUser,
//     updateUser,
//     updateUserPassword,
//     updateUserToManager,
//     getManager,
//     deleteUser,
//     getAllUsersManager,
//     selfDeactivate,
//     activateUser,
//     deactivateUser,
// } = require('../controllers/userController');

// /**
//  * @swagger
//  * tags:
//  *   name: Users
//  *   description: User management routes
//  */

// /**
//  * @swagger
//  * /users:
//  *   get:
//  *     summary: Get all users (admin only)
//  *     description: Retrieve all users (admin access only).
//  *     tags:
//  *       - Users
//  *     responses:
//  *       200:
//  *         description: A list of all users.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   id:
//  *                     type: string
//  *                     description: The user ID.
//  *                   name:
//  *                     type: string
//  *                   email:
//  *                     type: string
//  *       403:
//  *         description: Forbidden. Only admin users can access this endpoint.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.route('/').get(authenticateUser, authrorizePermissions('admin'), getAllUsers);

// /**
//  * @swagger
//  * /users/updateUserToManager:
//  *   patch:
//  *     summary: Update user to manager (admin only)
//  *     description: Grant manager privileges to a user (admin access only).
//  *     tags:
//  *       - Users
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               userId:
//  *                 type: string
//  *                 description: The ID of the user to update
//  *     responses:
//  *       200:
//  *         description: User updated to manager successfully.
//  *       404:
//  *         description: User not found.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.route('/updateUserToManager').patch(authenticateUser, authrorizePermissions('admin'), updateUserToManager);

// /**
//  * @swagger
//  * /users/{id}:
//  *   delete:
//  *     summary: Delete a user (admin only)
//  *     description: Delete a user by their ID (admin access only).
//  *     tags:
//  *       - Users
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The user ID
//  *     responses:
//  *       200:
//  *         description: User deleted successfully.
//  *       404:
//  *         description: User not found.
//  *       403:
//  *         description: Forbidden. Only admin users can delete users.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.route('/:id').delete(authenticateUser, authrorizePermissions('admin'), deleteUser);

// /**
//  * @swagger
//  * /users/manager/users:
//  *   get:
//  *     summary: Get all users managed by the manager
//  *     description: Retrieve all users managed by the authenticated manager.
//  *     tags:
//  *       - Users
//  *     responses:
//  *       200:
//  *         description: A list of managed users.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   id:
//  *                     type: string
//  *                     description: The user ID.
//  *                   name:
//  *                     type: string
//  *                   email:
//  *                     type: string
//  *       403:
//  *         description: Forbidden. Only managers can access this endpoint.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.route('/manager/users').get(authenticateUser, authrorizePermissions('manager'), getAllUsersManager);

// /**
//  * @swagger
//  * /users/showMe:
//  *   get:
//  *     summary: Show the authenticated user's profile
//  *     description: Retrieve the profile information of the authenticated user.
//  *     tags:
//  *       - Users
//  *     responses:
//  *       200:
//  *         description: The authenticated user's profile information.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.route('/showMe').get(authenticateUser, showUser);

// /**
//  * @swagger
//  * /users/updateUser:
//  *   patch:
//  *     summary: Update the authenticated user's profile
//  *     description: Update the profile information of the authenticated user.
//  *     tags:
//  *       - Users
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: User profile updated successfully.
//  *       400:
//  *         description: Invalid input.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.route('/updateUser').patch(authenticateUser, updateUser);

// /**
//  * @swagger
//  * /users/updateUserPassword:
//  *   patch:
//  *     summary: Update the authenticated user's password
//  *     description: Update the password of the authenticated user.
//  *     tags:
//  *       - Users
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               oldPassword:
//  *                 type: string
//  *               newPassword:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Password updated successfully.
//  *       400:
//  *         description: Invalid input.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);

// /**
//  * @swagger
//  * /users/getManager:
//  *   get:
//  *     summary: Get the authenticated user's manager
//  *     description: Retrieve the manager information for the authenticated user.
//  *     tags:
//  *       - Users
//  *     responses:
//  *       200:
//  *         description: Manager information retrieved successfully.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.route('/getManager').get(authenticateUser, getManager);

// /**
//  * @swagger
//  * /users/{id}:
//  *   get:
//  *     summary: Get a specific user by ID
//  *     description: Retrieve a user by their ID.
//  *     tags:
//  *       - Users
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The user ID
//  *     responses:
//  *       200:
//  *         description: User information retrieved successfully.
//  *       404:
//  *         description: User not found.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.route('/:id').get(authenticateUser, getUser);

// /**
//  * @swagger
//  * /users/{id}/activate:
//  *   patch:
//  *     summary: Activate a user (admin only)
//  *     description: Activate a deactivated user (admin access only).
//  *     tags:
//  *       - Users
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The user ID
//  *     responses:
//  *       200:
//  *         description: User activated successfully.
//  *       404:
//  *         description: User not found.
//  *       403:
//  *         description: Forbidden. Only admin users can activate users.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.route('/:id/activate').patch(authenticateUser, authrorizePermissions('admin'), activateUser);

// /**
//  * @swagger
//  * /users/{id}/deactivate:
//  *   patch:
//  *     summary: Deactivate a user
//  *     description: Deactivate a user by their ID.
//  *     tags:
//  *       - Users
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The user ID
//  *     responses:
//  *       200:
//  *         description: User deactivated successfully.
//  *       404:
//  *         description: User not found.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.route('/:id/deactivate').patch(authenticateUser, deactivateUser);

// /**
//  * @swagger
//  * /users/selfDeactivate:
//  *   patch:
//  *     summary: Self-deactivate the authenticated user
//  *     description: Deactivate the authenticated user's own account.
//  *     tags:
//  *       - Users
//  *     responses:
//  *       200:
//  *         description: User deactivated successfully.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.route('/selfDeactivate').patch(authenticateUser, selfDeactivate);

// module.exports = router;



const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const { authrorizePermissions } = require('../middleware/permissions');

const {
    getAllUsers,
    getUser,
    showUser,
    updateUser,
    updateUserPassword,
    updateUserToManager,
    getManager,
    deleteUser,
    getAllUsersManager,
    selfDeactivate,
    activateUser,
    deactivateUser,
} = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management routes
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (admin only)
 *     description: Retrieve all users (admin access only).
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of all users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The user ID.
 *                   username:
 *                     type: string
 *                     description: The username of the user.
 *                   email:
 *                     type: string
 *                     description: The email of the user.
 *                   role:
 *                     type: string
 *                     description: The role of the user (e.g., 'user', 'manager', 'admin').
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: When the user was created.
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: When the user was last updated.
 *       403:
 *         description: Forbidden. Only admin users can access this endpoint.
 *     security:
 *       - bearerAuth: []
 */
router.route('/').get(authenticateUser, authrorizePermissions('admin'), getAllUsers);

/**
 * @swagger
 * /users/updateUserToManager:
 *   patch:
 *     summary: Update user to manager (admin only)
 *     description: Grant manager privileges to a user (admin access only).
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user to update
 *     responses:
 *       200:
 *         description: User updated to manager successfully.
 *       404:
 *         description: User not found.
 *     security:
 *       - bearerAuth: []
 */
router.route('/updateUserToManager').patch(authenticateUser, authrorizePermissions('admin'), updateUserToManager);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     description: Delete a user by their ID (admin access only).
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 *       403:
 *         description: Forbidden. Only admin users can delete users.
 *     security:
 *       - bearerAuth: []
 */
router.route('/:id').delete(authenticateUser, authrorizePermissions('admin'), deleteUser);

/**
 * @swagger
 * /users/manager/users:
 *   get:
 *     summary: Get all users managed by the manager
 *     description: Retrieve all users managed by the authenticated manager.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of managed users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The user ID.
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *       403:
 *         description: Forbidden. Only managers can access this endpoint.
 *     security:
 *       - bearerAuth: []
 */
router.route('/manager/users').get(authenticateUser, authrorizePermissions('manager'), getAllUsersManager);

/**
 * @swagger
 * /users/showMe:
 *   get:
 *     summary: Show the authenticated user's profile
 *     description: Retrieve the profile information of the authenticated user.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: The authenticated user's profile information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *     security:
 *       - bearerAuth: []
 */
router.route('/showMe').get(authenticateUser, showUser);

/**
 * @swagger
 * /users/updateUser:
 *   patch:
 *     summary: Update the authenticated user's profile
 *     description: Update the profile information of the authenticated user.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully.
 *       400:
 *         description: Invalid input.
 *     security:
 *       - bearerAuth: []
 */
router.route('/updateUser').patch(authenticateUser, updateUser);

/**
 * @swagger
 * /users/updateUserPassword:
 *   patch:
 *     summary: Update the authenticated user's password
 *     description: Update the password of the authenticated user.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *       400:
 *         description: Invalid input.
 *     security:
 *       - bearerAuth: []
 */
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);

/**
 * @swagger
 * /users/getManager:
 *   get:
 *     summary: Get the authenticated user's manager
 *     description: Retrieve the manager information for the authenticated user.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Manager information retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *     security:
 *       - bearerAuth: []
 */
router.route('/getManager').get(authenticateUser, getManager);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a specific user by ID
 *     description: Retrieve a user by their ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User information retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       404:
 *         description: User not found.
 *     security:
 *       - bearerAuth: []
 */
router.route('/:id').get(authenticateUser, getUser);

/**
 * @swagger
 * /users/{id}/activate:
 *   patch:
 *     summary: Activate a user (admin only)
 *     description: Activate a deactivated user (admin access only).
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User activated successfully.
 *       404:
 *         description: User not found.
 *       403:
 *         description: Forbidden. Only admin users can activate users.
 *     security:
 *       - bearerAuth: []
 */
router.route('/:id/activate').patch(authenticateUser, authrorizePermissions('admin'), activateUser);

/**
 * @swagger
 * /users/{id}/deactivate:
 *   patch:
 *     summary: Deactivate a user
 *     description: Deactivate a user by their ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deactivated successfully.
 *       404:
 *         description: User not found.
 *     security:
 *       - bearerAuth: []
 */
router.route('/:id/deactivate').patch(authenticateUser, deactivateUser);

/**
 * @swagger
 * /users/selfDeactivate:
 *   patch:
 *     summary: Self-deactivate the authenticated user
 *     description: Deactivate the authenticated user's own account.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User deactivated successfully.
 *     security:
 *       - bearerAuth: []
 */
router.route('/selfDeactivate').patch(authenticateUser, selfDeactivate);

module.exports = router;
