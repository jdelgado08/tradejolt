const Account = require('../models/Account')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { createUserToken, cookieToRes, checkPermissions } = require('../utils')


//user/manager

//create account
const createAccount = async (req, res) => {
    const { accountName, initialBalance } = req.body
    const currentBalance = initialBalance

    const duplicatedAccountName = await Account.findOne({ accountName })
    if (duplicatedAccountName) {
        throw new CustomError.BadRequestError('Account Name already in use, pls provide a diferent name')
    }
    
    // console.log(req.user);
    
    const account = await Account.create({
        userId: req.user.userId,
        accountName,
        initialBalance,
        currentBalance
    });

    res.status(StatusCodes.CREATED).json({Account : account })
}

//get all Accounts for the actual user
const getAllAccountsUser = async (req, res) => {
    const userId = req.user.userId
    const accounts = await Account.find({ userId })
    
    // console.log(accounts);
    if (accounts.length === 0) {
        throw new CustomError.NotFoundError('you dont have any accounts')
    }

    res.status(StatusCodes.OK).json({Accounts : accounts })
}
//get single account 
const getAccount = async (req, res) => {
    res.send('get Account')
}

const updateAccount = async (req, res) => {
    res.send('update account info')
}

//admin
const deleteAccount = async (req, res) => {
    res.send('delete account /:id')
}
//get all accounts
const getAllAccounts = async (req, res) => {
    res.send('get all accounts')
}

module.exports = {
    createAccount,
    getAllAccountsUser,
    getAccount,
    updateAccount,
    deleteAccount,
    getAllAccounts

}