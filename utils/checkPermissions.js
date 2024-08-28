const User = require('../models/User');
const CustomError = require('../errors')
const Account = require('../models/Account');

const checkPermissions = async (requestUser, resourceUserId) => {

    if (requestUser.role === 'admin') return;
    // If the user is a manager, check if the user belong to him
    if (requestUser.role === 'manager') {
        const managedUsers = await User.find({ managerId: requestUser.userId }).select('_id');
        const managedUserIds = managedUsers.map(user => user._id.toString());
        if (managedUserIds.includes(resourceUserId.toString())) return;
    }

    if (requestUser.userId === resourceUserId.toString()) return;

    throw new CustomError.UnauthorizedError('Not authorized to access!');
}

const checkUserPermissions = (requestUser, resourceUserId) => {
    if (requestUser.role === 'admin') return;
    if (requestUser.userId === resourceUserId.toString()) return;
    throw new CustomError.UnauthorizedError('Not authorized to access!');
};

const getAccessibleAccounts = async (requestUser, accountId = null) => {

    // console.log('Account:', Account);
    // Admin can access all accounts
    if (requestUser.role === 'admin') {
        return accountId ? [accountId] : [];
    }

    let accounts = [];
    if (accountId) {
        // Check if the user has access to the specific account
        const account = await Account.findById(accountId);
        if (!account) {
            throw new CustomError.NotFoundError(`Account with id ${accountId} not found`);
        }

        // Check if the user owns the account or manages it
        if (requestUser.userId === account.userId.toString() || requestUser.role === 'manager') {
            accounts.push(account._id);
        } else {
            throw new CustomError.UnauthorizedError('User does not have access to this account');
        }
    } else {
        // Retrieve all accessible accounts for the user
        if (requestUser.role === 'manager') {
            const managedUsers = await User.find({ managerId: requestUser._id }).select('_id');
            const managedUserIds = managedUsers.map(user => user._id);
            accounts = await Account.find({ userId: { $in: managedUserIds } }).select('_id');
        } else {
            accounts = await Account.find({ userId: requestUser.userId }).select('_id');
        }
    }

    // If no accounts found or user doesn't have access to any accounts
    if (!accounts || accounts.length === 0) {
        throw new CustomError.UnauthorizedError('User does not have access to any accounts');
    }

    return accounts.map(account => account._id);
};



module.exports = {
    checkPermissions,
    checkUserPermissions,
    getAccessibleAccounts,
}