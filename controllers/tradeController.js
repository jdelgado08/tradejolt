const Trade = require('../models/Trade')
const Account = require('../models/Account')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { 
    checkPermissions, 
    checkPermissionsUser,

 } = require('../utils')

const createTrade = async (req, res) =>{
    
    const {
        accountId,
        symbol,
        tradeDate,
        entryTime,
        exitTime,
        entryPrice,
        exitPrice,
        size,
        tradeType,
        fees,
        notes,
        image,
        netProfitLoss,

    } = req.body 

    const account = await Account.findById(accountId)

    if (!account) {
        throw new CustomError.NotFoundError(`Account with id: ${accountId} wasn't found`)
    }

    checkPermissionsUser(req.user, account.userId)

    // const entryTimeString = 
    // const exitTimeString = 


    // console.log(`Parsed entry time string: ${entryTimeString}`);
    // console.log(`Parsed exit time string: ${exitTimeString}`);

    const castEntryTime = new Date(`${tradeDate}T${entryTime}Z`)
    const castExitTime = new Date(`${tradeDate}T${exitTime}Z`)

    const tradeEntry = await Trade.create({
        accountId,
        symbol,
        tradeDate: new Date(tradeDate),
        entryTime : castEntryTime,
        exitTime : castExitTime,
        entryPrice,
        exitPrice,
        size,
        tradeType,
        fees,
        notes,
        image,
        netProfitLoss
    })

    const updateBalance = netProfitLoss - fees
    account.currentBalance += updateBalance

    await account.save()

    res.status(StatusCodes.CREATED).json(tradeEntry)
}
const getAllTradesAccount = async (req, res) =>{
    res.send('Get All trader per Account')
}
const getTrade = async (req, res) =>{
    res.send('Get Trade')
}
const updateTrade = async (req, res) =>{
    res.send('update Trade')
}
const deleteTrade = async (req, res) =>{
    res.send('Delete Trade')
}
//admin
const getAllTrades = async (req, res) =>{
    res.send('get all trades')
}


module.exports = {
    createTrade,
    getAllTradesAccount,
    getTrade,
    updateTrade,
    deleteTrade,
    getAllTrades,

}