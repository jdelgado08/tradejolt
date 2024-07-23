const Trade = require('../models/Trade');
const Account = require('../models/Account');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
    checkPermissions,

} = require('../utils');


const createComment = async (req, res) => {

    const tradeId = req.params.id;
    const { content } = req.body;
    const { userId } = req.user;


    console.log(content);
    const trade = await Trade.findById(tradeId);

    if (!trade) {
        throw new CustomError.NotFoundError(`Trade with id: ${tradeId} wasn't found`)
    };

    //find the person that made the trade
    const account = await Account.findById(trade.accountId);
    if (!account || account.userId.toString() !== userId.toString()) {
        throw new CustomError.UnauthorizedError('You are not authorized to comment in this trade olease contact your manager');
    };

    if (trade.comment) {
        throw new CustomError.BadRequestError(`Trade with id: ${tradeId} already as a comment, pls update instead of cerate.`)
    };

    const comment = await Comment.create({ tradeId, userId, content });

    trade.comment = comment._id;
    await trade.save();


    res.status(StatusCodes.CREATED).json({Content : content, Id : comment._id});
};

const getComment = async (req, res) => {

    const tradeId = req.params.id;
    const userId = req.user.userId;

    const trade = await Trade.findById(tradeId);
    if (!trade) {
        throw new CustomError.NotFoundError(`Trade with id: ${tradeId} wasn't found`)
    }


    const comment = await Comment.findById(trade.comment)

    if (!comment) {
        throw new CustomError.NotFoundError(`Trade with id: ${tradeId} doesnt have any comments`);
    }

    await checkPermissions(req.user, comment.userId);

    res.status(StatusCodes.OK).json({ Comment_Content: comment.content, id: comment._id });
};

const getAllComments = async (req, res) => {

    const userId = req.user.userId;
    const userRole = req.user.role;
  
    let comments;
  
    if (userRole === 'admin') {
      // Admin all comments
      comments = await Comment.find()
        .populate('userId', 'username')
        .populate('tradeId', 'symbol tradeDate netProfitLoss');

    } else if (userRole === 'manager') {
      // Manager sees comments from users they manage
      const managedUsers = await User.find({ managerId: userId }).select('_id');
      const managedUserIds = managedUsers.map(user => user._id);
      comments = await Comment.find({ userId: { $in: managedUserIds } })
        .populate('userId', 'username')
        .populate('tradeId', 'symbol tradeDate netProfitLoss');

    } else {
      // User sees their own comments
      comments = await Comment.find({ userId: userId })
        .populate('userId', 'username')
        .populate('tradeId', 'symbol tradeDate netProfitLoss');
    }
  
    res.status(StatusCodes.OK).json({ comments });
};

const updateComment = async (req, res) => {

    const commentId = req.params.id;
    const { content } = req.body;
    const userId = req.user.userId;

    // console.log(`UserId = ${userId} content = ${content}`);

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new CustomError.NotFoundError(`Comment with id: ${commentId} wasn't found`)
    };

    //only the user resource can update.
    if (comment.userId.toString() !== userId.toString()) {
        throw new CustomError.UnauthorizedError('Not authorized to update this comment please contact your supervisor.');
    }
    comment.content = content;
    comment.save();

    res.status(StatusCodes.OK).json({ New_Comment: content });
}

const deleteComment = async (req, res) => {

    const commentId = req.params.id;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new CustomError.NotFoundError(`Comment with id: ${commentId} wasn't found`);
    };

    // Only user who created OR admin can delete it.
    if (comment.userId.toString() !== userId.toString() && userRole !== 'admin') {
        throw new CustomError.UnauthorizedError('Not authorized to delete this comment');
    }

    // remove comment reference from trade
    const trade = await Trade.findOne({ comment: comment._id });
    if (trade) {
        trade.comment = undefined; 
        await trade.save();
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(StatusCodes.OK).json({ Msg: 'Comment deleted' });
}

//by the end update the .hook once we delete a trade we delete the comments aswell. DONE
//.pos save to create a comment straight a trade creation if data passed DONE


module.exports = {
    createComment,
    getComment,
    getAllComments,
    updateComment,
    deleteComment,

};