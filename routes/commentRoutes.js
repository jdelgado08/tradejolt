const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');



const {
    createComment,
    getComment,
    getAllComments,
    updateComment,
    deleteComment,
} = require('../controllers/commentController');

//routes

router.route('/all').get(authenticateUser, getAllComments);

router.route('/:id')
    .post(authenticateUser,createComment)
    .get(authenticateUser, getComment)
    .patch(authenticateUser,updateComment)
    .delete(authenticateUser, deleteComment);

module.exports = router;