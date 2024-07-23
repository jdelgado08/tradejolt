const express = require('express')
const router = express.Router()
const { authenticateUser } = require('../middleware/authentication')
const { authrorizePermissions } = require('../middleware/permissions')
const {fileUploadMiddleware} = require('../middleware/fileUpload');

const {
    createTrade,
    getAllTradesAccount,
    getTrade,
    updateTrade,
    deleteTrade,
    getAllTrades,
    uploadTradesExcell,
    getAllTradeEntryManager,
    
} = require('../controllers/tradeController')

//routes

router.route('/allEntrysAccount/:accountId').get(authenticateUser, getAllTradesAccount)

router.route('/upload/Excel/:accountId').post(authenticateUser,fileUploadMiddleware, uploadTradesExcell)

router.route('/all').get(authenticateUser, authrorizePermissions('admin'), getAllTrades)
router.route('/all/manager/userTrades').get(authenticateUser, authrorizePermissions('manager'), getAllTradeEntryManager)

router.route('/:id')
    .post(authenticateUser,createTrade)
    .get(authenticateUser, getTrade)
    .patch(authenticateUser,updateTrade)
    .delete(authenticateUser, deleteTrade)

module.exports = router