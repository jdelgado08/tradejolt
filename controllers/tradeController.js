const Trade = require('../models/Trade')
const Account = require('../models/Account')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { 
    checkPermissions,

 } = require('../utils')

 //create a trade entry
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

   await checkPermissions(req.user, account.userId)

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
        netProfitLoss,
        
    })

    const updateBalance = netProfitLoss - fees
    account.currentBalance += updateBalance

    await account.save()

    res.status(StatusCodes.CREATED).json(tradeEntry)
}
//get all trade entry from an Account (accountId)
const getAllTradesAccount = async (req, res) =>{
    
   const accountId = req.params.accountId

        const account = await Account.findById(accountId)
        if (!account) {
            throw new CustomError.NotFoundError(`Account with id: ${accountId} wasn't found`)
        }

        await checkPermissions(req.user, account.userId)

        const allEntrys = await Trade.find({ accountId })
        
        res.status(StatusCodes.OK).json({ TradingEntrys: allEntrys })

}
const getTrade = async (req, res) =>{
    const tradeId = req.params.id

    const tradeEntry = await Trade.findById(tradeId)

    if (!tradeEntry) {
        throw new CustomError.NotFoundError(`Trade entry with id: ${tradeId} wasn't found`)
    }

    const account = await Account.findById(tradeEntry.accountId)

   await checkPermissions(req.user, account.userId)

    

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