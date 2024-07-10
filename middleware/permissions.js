const CustomError = require('../errors')


const authrorizePermissions = (...roles)=>{ // ... collect the values pased in
    // console.log(roles);
    return (req, res, next)=>{
        console.log('ping middleware pemission');
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError('Unauthorize to acess this route')
        }
        // console.log(req.user);
        next()
    }
}

module.exports = {
    authrorizePermissions,

}