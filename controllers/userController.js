const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { createUserToken , cookieToRes, checkPermissions } = require('../utils')



//admin
const getAllUsers = async (req, res) => {
    //console.log(req.user);
    const users = await User.find({ role: 'user' }).select('-password')
    res.status(StatusCodes.OK).json({ users })

}

//users
const getUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }).select('-password')
    if (!user) {
        throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`)
    }
    // console.log(user.username);
    checkPermissions(req.user, user._id)
    res.status(StatusCodes.OK).json({ user })
}
const showUser = async (req, res) => {
    //no need to query DB, have user in Cookie
    res.status(StatusCodes.OK).json({ user: req.user })
}
//updt user with .save
const updateUser = async (req, res) => {
    const { email, username, firstName, lastName } = req.body
    //     console.log(req.body); // catch everything
        if (!email || !username || !firstName || !lastName) {
            throw new CustomError.BadRequestError('Please provide all the Values')
        }
    const user = await User.findOne({_id : req.user.userID})
    // console.log(user);

    user.username = username
    user.email = email
    user.firstName = firstName
    user.lastName = lastName

    await user.save()

    const tokenUser = createUserToken(user)

    cookieToRes({ res, user: tokenUser })//to updt again the cookie
    res.status(StatusCodes.OK).json({ user: tokenUser })

}
const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('plesase provide old and new password')
    }
    const user = await User.findOne({ _id: req.user.userID })
    console.log(req.user.userID);
    const passwordCorrect = await user.comparePassword(oldPassword)
    if (!passwordCorrect) {
        throw new CustomError.UnauthenticatedError('please provide all the values')
    }
    user.password = newPassword;
    await user.save()//invoque de hook .pre
    res.status(StatusCodes.OK).json({ msg: 'Sucess!Password updated!' })
}

const updateUserToManager = async (req,res) =>{
    const { newRole, email } = req.body
    //     console.log(req.body); // catch everything
        if (!newRole || !email) {
            throw new CustomError.BadRequestError('Please provide the all values required')
        }
    const user = await User.findOne({email : email})
    // console.log(user);
    if (!user) {
        throw new CustomError.NotFoundError(` user with the ${email} not found, please try again`)
    }
    
    user.role = newRole

    await user.save()

    const tokenUser = createUserToken(user)

    cookieToRes({ res, user: tokenUser })//to updt again the cookie
    res.status(StatusCodes.OK).json({ user: tokenUser })
}

module.exports = {
    getAllUsers,
    getUser,
    showUser,
    updateUser,
    updateUserPassword,
    updateUserToManager,

}
