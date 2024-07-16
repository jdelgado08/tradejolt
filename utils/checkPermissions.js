const User = require('../models/User');
const CustomError = require('../errors')

const checkPermissions = async (requestUser, resourceUserId) => {

    if (requestUser.role === 'admin') return;

    // If the user is a manager, check if they manage the resource user
    if (requestUser.role === 'manager') {
        const managedUsers = await User.find({ managerId: requestUser.userId }).select('_id');
        const managedUserIds = managedUsers.map(user => user._id.toString());
        if (managedUserIds.includes(resourceUserId.toString())) return;
    }

    if (requestUser.userId === resourceUserId.toString()) return;

    throw new CustomError.UnauthorizedError('Not authorized to access!');
}


module.exports = {
    checkPermissions,
}