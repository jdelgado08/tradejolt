
const CustomError = require('../errors')

const checkPermissions = (requestUser, resourceUserID) => {

    // console.log(typeof resourceUserID);
    if (requestUser.role === 'admin') return
    if(requestUser.userID === resourceUserID.toString()) return
    throw new CustomError.UnauthorizedError('Not authorized to acess!')
}

module.exports = {
    checkPermissions
}