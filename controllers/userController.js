const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { createUserToken, cookieToRes, checkPermissions } = require('../utils')



//admin

const getAllUsers = async (req, res) => {
    //console.log(req.user);
    const users = await User.find({ role: { $in: ['user', 'manager'] } }).select('-password')
    res.status(StatusCodes.OK).json({ users })

}
const updateUserToManager = async (req, res) => {
    const { email } = req.body
    //     console.log(req.body); // catch everything
    if (!email) {
        throw new CustomError.BadRequestError('Please provide the all values required')
    }
    const user = await User.findOne({ email: email })
    // console.log(user);
    if (!user) {
        throw new CustomError.NotFoundError(` user with the ${email} not found, please try again`)
    }
    // console.log(user._id);
    // throw new CustomError.BadRequestError('Teste Error on updtUserToManager')
    user.role = 'manager'
    user.managerId = user._id

    await user.save()

    const tokenUser = createUserToken(user)

    cookieToRes({ res, user: tokenUser })//to updt again the cookie
    res.status(StatusCodes.OK).json({ user: tokenUser })
}
const deleteUser = async (req, res) => {
    const { id } = req.params

    const user = await User.findByIdAndDelete(id)

    if (!user) {
        throw new CustomError.NotFoundError(`User with ${id} doesn't exist`)
    }
    res.status(StatusCodes.OK).json({ user })



}
//manager
const getAllUsersManager = async (req, res) => {

    const managerId = req.user.userId;

    const managedUsers = await User.find({ managerId })

    // console.log(managedUsers);

    const userIds = managedUsers.map(user => user._id);

    if (userIds.length === 0) {
        throw new CustomError.NotFoundError(`No users found for the manager`);
    }


    res.status(StatusCodes.OK).json({ Users: userIds })

}

//user
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
    // console.log(req.user);
    
    res.status(StatusCodes.OK).json({ user: req.user })
}
const updateUser = async (req, res) => {
    const { email, username, firstName, lastName, managerId } = req.body
    //     console.log(req.body); // catch everything
    if (!email || !username || !firstName || !lastName) {
        throw new CustomError.BadRequestError('Please provide all the Values')
    }
    const user = await User.findOne({ _id: req.user.userId })
    // console.log(user);

    user.username = username
    user.email = email
    user.firstName = firstName
    user.lastName = lastName
    user.managerId = managerId
    if (user.role === 'manager') {
        user.managerId = req.user.userId
    }

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
    const user = await User.findOne({ _id: req.user.userId })
    // console.log(req.user.userId);
    const passwordCorrect = await user.comparePassword(oldPassword)
    if (!passwordCorrect) {
        throw new CustomError.UnauthenticatedError('please provide all the values')
    }
    user.password = newPassword;
    await user.save()//invoque de hook .pre
    res.status(StatusCodes.OK).json({ msg: 'Sucess!Password updated!' })
}

const getManager = async (req, res) => {
    const managers = await User.find({ role: 'manager' }).select('firstName lastName _id')
    if (!managers) {
        throw new CustomError.NotFoundError(`No managers available, pls contact your admin.`)
    }
    res.status(StatusCodes.OK).json({ managers })
}

const selfDeactivate = async (req, res) => {

    
    const user = await User.findById(req.user.userId);
    
    if (!user) {
        throw new CustomError.NotFoundError(`No user with id : ${req.user.userId}`)
    }

    checkPermissions(req.user, req.user.userId);

    user.isActive = false;

    await user.save();

    res.status(StatusCodes.OK).json({ msg: "Your Accoiunt was deactivate, to activate again contact your manager" })
}

const deactivateUser = async (req, res) => {
    
    const { id } = req.params;

    
    const user = await User.findById(id);
    if (!user) {
        throw new CustomError.NotFoundError(`No user with id : ${id}`)
    }
    checkPermissions(req.user, user._id);

    user.isActive = false;

    await user.save();

    res.status(StatusCodes.OK).json({ msg: "User was deactivate successfully!" })
}

const activateUser = async (req, res) => {
    
    const { id } = req.params;

    if (req.user.role !== 'admin') {
        throw new CustomError.UnauthorizedError('Only admins can activate users');
    }
    
    const user =await User.findById(id);
    if (!user) {
        throw new CustomError.NotFoundError(`No user with id : ${id}`)
    }

    user.isActive = true;

    await user.save();

    res.status(StatusCodes.OK).json({ msg: "User was Activate successfully!" })
}
module.exports = {
    getAllUsers,
    getUser,
    showUser,
    updateUser,
    updateUserPassword,
    updateUserToManager,
    getManager,
    deleteUser,
    getAllUsersManager,
    deactivateUser,
    activateUser,
    selfDeactivate,
}
