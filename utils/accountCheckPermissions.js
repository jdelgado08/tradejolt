const Account = require('../models/Account');
const CustomError = require('../errors');
const { checkPermissions } = require('./checkPermissions');
const User = require('../models/User');

const accountCheckPermissions = async (req, res, next) => {

    console.log("Checking account permissions...");
    
    const { accountId } = req.query;

    if (req.user.role === 'admin') {
        return next(); //full acess
    }

    let accounts;
    if (accountId) {
        const account = await Account.findById( accountId );

        if (!account) {
            throw new CustomError.NotFoundError(`Account with id ${accountId} not found`);
        };
        
        await checkPermissions(req.user, account.userId);
        req.accessibleAccounts = [account._id];   

    } else {
        if (req.user.role === 'manager') {
          const managedUsers = await User.find({ managerId: req.user._id }).select('_id');
          const managedUserIds = managedUsers.map(user => user._id);
          accounts = await Account.find({ userId: { $in: managedUserIds } }).select('_id');
        } else {
          accounts = await Account.find({ userId: req.user._id }).select('_id');
        }
  
        if (!accounts || accounts.length === 0) {
          throw new CustomError.NotFoundError('No accounts found');
        }
  
        req.accessibleAccounts = accounts.map(account => account._id);
      }
  
      next();
};

module.exports = accountCheckPermissions;