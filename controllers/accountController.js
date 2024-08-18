const Account = require('../models/Account');
const User = require('../models/User');
const AccountBalance = require ('../models/AccountBalance');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { 
    checkPermissions 
} = require('../utils');

//user/manager

//create account
const createAccount = async (req, res) => {
    const { accountName, initialBalance } = req.body;
    const currentBalance = initialBalance;

    const duplicatedAccountName = await Account.findOne({ accountName });
    if (duplicatedAccountName) {
        throw new CustomError.BadRequestError('Account Name already in use, pls provide a diferent name');
    }
    
    // console.log(req.user);
    
    const account = await Account.create({
        userId: req.user.userId,
        accountName,
        initialBalance,
        currentBalance
    });

    const accountBalance = await AccountBalance.create({
        accountId: account._id,
        date: new Date(),
        balance: currentBalance
    });

    res.status(StatusCodes.CREATED).json({Account : account, AccountBalance : accountBalance });
};

//get all Accounts for the actual user
const getAllAccountsUser = async (req, res) => {
    const userId = req.user.userId;
    const accounts = await Account.find({ userId });
    
    // console.log(accounts);
    if (accounts.length === 0) {
        throw new CustomError.NotFoundError('you dont have any accounts');
    }

    res.status(StatusCodes.OK).json({Accounts : accounts });
};
//get single account 
const getAccount = async (req, res) => {
    const accountId = req.params.id;
    const account = await Account.findById(accountId);

    if(!account){
        throw new CustomError.NotFoundError(`No account with id: ${req.params.id}`);
    }
    // console.log(req.user.userId + account.userId);
    //make sure you can only see acc of the requested user.
    await checkPermissions(req.user, account.userId);
    res.status(StatusCodes.OK).json({ account });
};

const updateAccount = async (req, res) => {
    const {id} = req.params;
    const {accountName, newBalance, emailReport} = req.body;

    const account  = await Account.findById(id);
    if (!account){
        throw new CustomError.NotFoundError(`No account with id: ${id}`); 
    }

    await checkPermissions(req.user, account.userId);
    //if account name update with new
    if(accountName){
        account.accountName = accountName;
    }
    
    // Update currentBalance if newBalance is provided
    if (newBalance !== undefined) {
         //add or sub the balance with newBalance
        const updatedBalance = account.currentBalance + newBalance;
        if (updatedBalance < 0) {
            throw new CustomError.BadRequestError("Not enoth balance, can't go below 0");
        }
        
        account.currentBalance = updatedBalance;
    }
    
    if (emailReport) {
        account.emailReport = emailReport;
    }

    await account.save();  
    
    res.status(StatusCodes.OK).json(account);
};
//admin
//cause doesnt make much sense delete Accounts
//maybe do another that remove the permisson of a user to have acess to ACC.
const deleteAccount = async (req, res) => {
    const { id } = req.params;

    const account = await Account.findById(id);
    if (!account) {
      throw new CustomError.NotFoundError(`Account with id: ${id} doesn't exist`);
    }

    await account.deleteOne();

    res.status(StatusCodes.OK).json({ message: 'Account and related data deleted successfully' });
    
    // const {id } = req.params

    // const account = await Account.findByIdAndDelete(id)

    // if (!account) {
    //     throw new CustomError.NotFoundError(`Account with ${id} doesn't exist`)
    // }
    // res.status(StatusCodes.OK).json({ account })
    //need to think if i delete the trades relates with this accoutn once i delete account.
};

//get all accounts by admin

const getAllAccounts = async (req, res) => {
    
    const accounts = await Account.find();

    res.status(StatusCodes.OK).json({ Accounts : accounts });
};
//get all accounts where manager match user
const getAllAccountsManager = async (req, res) => {
    
    const managerId = req.user.userId;

    // console.log(managerId);
    // Find all users managed by this manager
    const managedUsers = await User.find({ managerId });

    // console.log(managedUsers);

    const userIds = managedUsers.map(user => user._id);

    if (userIds.length === 0) {
        throw new CustomError.NotFoundError(`No users found for the manager`);
    }

    // Find all accounts that belong to these users
    const accounts = await Account.find({ userId: { $in: userIds } });

    if (!accounts || accounts.length === 0) {
      throw new CustomError.NotFoundError(`No accounts found for the managed users`);
    }

    res.status(StatusCodes.OK).json({ Accounts : accounts });
};

const accountIsActive = async (req, res) =>{

    //get Account ID -params
    //get isActive - body
    //change isActive
    //make sure route is protect only by admin acess

    const {id} = req.params;
    const {isActive } = req.body;

    
    const account = await Account.findById( id );

    if (!account) {
        throw new CustomError.NotFoundError(`No account with id : ${id}`);
    }

    account.isActive = isActive;

    account.save();
    
    res.status(StatusCodes.OK).json({ msg : "Account state updated successfully" });

};


module.exports = {
    createAccount,
    getAllAccountsUser,
    getAccount,
    updateAccount,
    deleteAccount,
    getAllAccounts,
    getAllAccountsManager,
    accountIsActive,
};
