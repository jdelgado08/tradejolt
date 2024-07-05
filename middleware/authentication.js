const CustomError = require('../errors')
const { checkToken } = require('../utils')


const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token
    if (!token) {
        throw new CustomError.UnauthenticatedError('Authentication Fail!')
    }
    try {
        const payload = checkToken({token})

        req.user = {
            username : payload.username,
            role : payload.role,
            userID : payload.userID,
            firstName : payload. firstName,
            lastName : payload. lastName,

        }
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication Fail!')

    }
    next();
}





module.exports = {
    authenticateUser,

}