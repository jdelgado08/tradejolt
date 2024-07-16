const express = require('express')
const router = express.Router()
const { authenticateUser } = require('../middleware/authentication')
const { authrorizePermissions } = require('../middleware/permissions')

const {
    createTrade,
    getAllTradesAccount,
    getTrade,
    updateTrade,
    deleteTrade,
    getAllTrades,
    
} = require('../controllers/tradeController')

//routes

router.route('/').post(authenticateUser,createTrade)
router.route('/allEntrysAccount/:accountId').get(authenticateUser, getAllTradesAccount)

router.route('/all').get(authenticateUser, authrorizePermissions('admin'), getAllTrades)

router.route('/:id')
    .get(authenticateUser, getTrade)
    .patch(authenticateUser,updateTrade)

router.route('/:id').delete(authenticateUser, authrorizePermissions('admin'), deleteTrade)

module.exports = router