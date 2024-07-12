const Trade = require('../models/Trade')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { 
    createUserToken, 
    cookieToRes, 
    checkPermissions, 
    checkPermissionsUser,

 } = require('../utils')

const createTrade = async (req, res) =>{
    res.send('Create Trade')
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