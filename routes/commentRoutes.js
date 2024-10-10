// const express = require('express');



// const router = express.Router();
// const { authenticateUser } = require('../middleware/authentication');



// const {
//     createComment,
//     getComment,
//     getAllComments,
//     updateComment,
//     deleteComment,
// } = require('../controllers/commentController');

// //routes

// router.route('/all').get(authenticateUser, getAllComments);

// router.route('/:id')
//     .post(authenticateUser,createComment)
//     .get(authenticateUser, getComment)
//     .patch(authenticateUser,updateComment)
//     .delete(authenticateUser, deleteComment);

// module.exports = router;



// const express = require('express');
// const router = express.Router();
// const { authenticateUser } = require('../middleware/authentication');

// const {
//     createComment,
//     getAllComments,
//     updateComment,
//     deleteComment,
// } = require('../controllers/commentController');

// /**
//  * @swagger
//  * tags:
//  *   name: Comments
//  *   description: Routes for managing comments on trades
//  */

// /**
//  * @swagger
//  * /comments/{tradeId}:
//  *   get:
//  *     summary: Get all comments for a specific trade
//  *     description: Retrieve all comments associated with a specific trade by its trade ID.
//  *     tags:
//  *       - Comments
//  *     parameters:
//  *       - in: path
//  *         name: tradeId
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The trade ID
//  *     responses:
//  *       200:
//  *         description: A list of comments for the specified trade.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   id:
//  *                     type: string
//  *                     description: The comment ID.
//  *                   content:
//  *                     type: string
//  *                     description: The content of the comment.
//  *                   createdAt:
//  *                     type: string
//  *                     format: date-time
//  *                     description: The date and time the comment was created.
//  *       404:
//  *         description: Trade not found.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.get('/:tradeId', authenticateUser, getAllComments);

// /**
//  * @swagger
//  * /comments/{tradeId}:
//  *   post:
//  *     summary: Add a new comment to a trade
//  *     description: Create a new comment for a specific trade.
//  *     tags:
//  *       - Comments
//  *     parameters:
//  *       - in: path
//  *         name: tradeId
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
//  *               content:
//  *                 type: string
//  *                 description: The content of the comment.
//  *     responses:
//  *       201:
//  *         description: Comment added successfully.
//  *       400:
//  *         description: Invalid input.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.post('/:tradeId', authenticateUser, createComment);

// /**
//  * @swagger
//  * /comments/{commentId}:
//  *   patch:
//  *     summary: Update a comment
//  *     description: Update a specific comment by its ID.
//  *     tags:
//  *       - Comments
//  *     parameters:
//  *       - in: path
//  *         name: commentId
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The comment ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               content:
//  *                 type: string
//  *                 description: The updated content of the comment.
//  *     responses:
//  *       200:
//  *         description: Comment updated successfully.
//  *       404:
//  *         description: Comment not found.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.patch('/:commentId', authenticateUser, updateComment);

// /**
//  * @swagger
//  * /comments/{commentId}:
//  *   delete:
//  *     summary: Delete a comment
//  *     description: Delete a specific comment by its ID.
//  *     tags:
//  *       - Comments
//  *     parameters:
//  *       - in: path
//  *         name: commentId
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The comment ID
//  *     responses:
//  *       200:
//  *         description: Comment deleted successfully.
//  *       404:
//  *         description: Comment not found.
//  *     security:
//  *       - bearerAuth: []
//  */
// router.delete('/:commentId', authenticateUser, deleteComment);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');

const {
    createComment,
    getAllComments,
    updateComment,
    deleteComment,
} = require('../controllers/commentController');

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Routes for managing comments on trades
 */

/**
 * @swagger
 * /comments/{tradeId}:
 *   get:
 *     summary: Get all comments for a specific trade
 *     description: Retrieve all comments associated with a specific trade by its trade ID.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: tradeId
 *         schema:
 *           type: string
 *         required: true
 *         description: The trade ID
 *     responses:
 *       200:
 *         description: A list of comments for the specified trade.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The comment ID.
 *                   content:
 *                     type: string
 *                     description: The content of the comment.
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time the comment was created.
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The last time the comment was updated.
 *       404:
 *         description: Trade not found.
 *       401:
 *         description: Unauthorized access.
 *     security:
 *       - bearerAuth: []
 */
router.get('/:tradeId', authenticateUser, getAllComments);

/**
 * @swagger
 * /comments/{tradeId}:
 *   post:
 *     summary: Add a new comment to a trade
 *     description: Create a new comment for a specific trade.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: tradeId
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
 *               content:
 *                 type: string
 *                 description: The content of the comment.
 *     responses:
 *       201:
 *         description: Comment added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 id: "64acffgtr78f36f1f1"
 *                 content: "This is a new comment."
 *                 createdAt: "2024-07-10T14:30:00.000Z"
 *                 updatedAt: "2024-07-10T14:30:00.000Z"
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized access.
 *     security:
 *       - bearerAuth: []
 */
router.post('/:tradeId', authenticateUser, createComment);

/**
 * @swagger
 * /comments/{commentId}:
 *   patch:
 *     summary: Update a comment
 *     description: Update a specific comment by its ID.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The updated content of the comment.
 *     responses:
 *       200:
 *         description: Comment updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 id: "64acffgtr78f36f1f1"
 *                 content: "This is the updated comment."
 *                 createdAt: "2024-07-10T14:30:00.000Z"
 *                 updatedAt: "2024-07-10T16:30:00.000Z"
 *       404:
 *         description: Comment not found.
 *       401:
 *         description: Unauthorized access.
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:commentId', authenticateUser, updateComment);

/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     description: Delete a specific comment by its ID.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Comment deleted successfully."
 *       404:
 *         description: Comment not found.
 *       401:
 *         description: Unauthorized access.
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:commentId', authenticateUser, deleteComment);

module.exports = router;
