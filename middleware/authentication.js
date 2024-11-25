const CustomError = require('../errors')
const { checkToken } = require('../utils')


const authenticateUser = async (req, res, next) => {
    console.log("Authenticating user...");

    const token = req.signedCookies.token
    if (!token) {
        throw new CustomError.UnauthenticatedError('Authentication Fail!')
    }
    try {
        const payload = checkToken({token})

        req.user = {
            username : payload.username,
            role : payload.role,
            userId : payload.userId,
            firstName : payload. firstName,
            lastName : payload. lastName,
        }
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication Fail!');
    }
    next();
}

//test maybe need to refractor and change the checkpermnissions at Utils

// const adminAuth = async (req, res, next)=>{
//     if (req.user.role !== 'admin'){
//         console.log('Ping test admin');
//         throw new CustomError.UnauthorizedError('Not authorized to acess!') 
//     }
//     next();
// }

// const managerAuth = async (req, res, next)=>{
//     if (req.user.role !== 'manager'){
//         console.log('Ping test manager');
//         throw new CustomError.UnauthorizedError('Not authorized to acess!') 
//     }
//     next();
// }

module.exports = {
    authenticateUser,
    // adminAuth,
    // managerAuth,

}