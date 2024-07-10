const User = require('../models/User')
const { StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const {cookieToRes, createUserToken} = require('../utils')


const registerUser = async (req, res) => {
   //check duplicated mail
    const {email, username, password} = req.body
    const duplicatedEmail = await User.findOne({email})
    if(duplicatedEmail) {
        throw new CustomError.BadRequestError('Email already in use')
    }
    //create user
    const user = await User.create({email,username, password})
    const tokenUser = createUserToken (user) //payload
    // const token = creatJWT({payload:tokenUser})
    cookieToRes({res, user : tokenUser}) //cookie to response
    //console.log(user);
    res.status(StatusCodes.CREATED).json({ user:tokenUser })//recap, do proper jwt string
}
const loginUser = async (req, res) => {
    const {email, username, password, firstName, lastName} = req.body
    // res.send('Login User')
    if (!email || ! password) {
        throw new CustomError.BadRequestError('Please provide E-mail and Password')
    }
    const user = await User.findOne({email})
    if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    const passwordCorrect = await user.comparePassword(password)
    if (!passwordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    const tokenUser = createUserToken (user)
    cookieToRes({res, user : tokenUser}) 
    res.status(StatusCodes.OK).json({ user:tokenUser })//recap, do proper jwt string
}
const logoutUser = async (req, res) => { //only remove the cookie
    res.cookie('token', 'logout',{
        httpOnly:true,
        expires : new Date(Date.now()),
    })
    res.status(StatusCodes.OK).json({msg: 'user logOut'}) //dev propose only!!
}
const registerUserManager = async (req, res) => {
     const {email, username, password} = req.body
     const duplicatedEmail = await User.findOne({email})
     if(duplicatedEmail) {
         throw new CustomError.BadRequestError('Email already in use')
     }
     console.log(req.user);
     //test
    //  throw new CustomError.BadRequestError('Teste Only')
     //create user
     const role = 'manager'
     const user = await User.create({email,username, password, role})
     const tokenUser = createUserToken (user) //payload
     // const token = creatJWT({payload:tokenUser})
     cookieToRes({res, user : tokenUser}) //cookie to response
     //console.log(user);
     res.status(StatusCodes.CREATED).json({ user:tokenUser })//recap, do proper jwt string
 }
module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerUserManager,

}