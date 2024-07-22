const Comment = require('../models/Comment');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
    checkPermissions
} = require('../utils');



//change TradeModel comment. make sure only 1 comnment /trade

const createComment = async (req, res) => {
    res.send('Create Comment');
};

const getComment = async (req, res) => {
    res.send('get comment /:id');
};

const getAllComments = async (req, res) => {

    //try to make in a single route, check for User ROle, and show based on:
    // if role == admin -> show all users comments, do pipeline agregation to display with better meaning,
    // if role == manager -> show all user managed, do pipeline agregation to display with better meaning,
    // if role == user -> show all user comments, do pipeline agregation to display with better meaning,

    //ps if work update allROutes of other controllers in a similar way.

    res.send('get All Comments');
};

const updateComment = async (req, res) => {
    res.send('update comment /:id');
}

const deleteComment = async (req, res) => {
    res.send('delete comment /:id');
}




module.exports = {
    createComment,
    getComment,
    getAllComments,
    updateComment,
    deleteComment,

};