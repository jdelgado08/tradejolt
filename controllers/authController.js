const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')


const registerUser = async (req, res) => {
    const user = await User.create(req.body)
    console.log(user);
    res.status(StatusCodes.CREATED).json({ user })//sending all user, testing only
}
const loginUser = async (req, res) => {
    res.send('Login User')
}
const logoutUser = async (req, res) => {
    res.send('Logout User')
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
}