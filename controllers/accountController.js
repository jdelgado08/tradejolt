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

    const account = await Account.create({
        userId: req.user.userID,
        accountName,
        initialBalance,
        currentBalance
    });

    res.status(StatusCodes.OK).json(account)
}

//get all Accounts for the actual user
const getAllAccountsUser = async (req, res) => {
    console.log(req.user);
    res.send('get all user Accounts')
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