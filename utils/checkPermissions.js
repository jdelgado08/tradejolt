
const CustomError = require('../errors')

const checkPermissions = (requestUser, resourceUserId) => {

    // console.log(typeof resourceUserId);
    if (requestUser.role === 'admin') return
    // manager permission, passing the arg. Must check once i wanan do research by trade, and by user with same manager
    if (requestUser.role === 'manager') return
    if(requestUser.userId === resourceUserId.toString()) return
    throw new CustomError.UnauthorizedError('Not authorized to access!')
}


module.exports = {
    checkPermissions,
}