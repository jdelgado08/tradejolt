const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { cookieToRes, createUserToken } = require('../utils');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail')

const registerUser = async (req, res) => {
    //check duplicated mail
    const { email, username, password } = req.body;
    const duplicatedEmail = await User.findOne({ email });
    if (duplicatedEmail) {
        throw new CustomError.BadRequestError('Email already in use');
    };
    
    const emailConfirmationToken = crypto.randomBytes(20).toString('hex');
    //create User

    const user = await User.create({
        email,
        username,
        password,
        emailConfirmationToken,
    });

    const confirmEmailURL = `${req.protocol}://${req.get('host')}/api/auth/confirm-email?token=${emailConfirmationToken}`;

    await sendEmail({
        to: email,
        subject: 'Email Confirmation TradeJolt',
        text: `Confirm your email, click the following link: ${confirmEmailURL}`,
    });
    
    res.status(StatusCodes.CREATED).json({ msg: "User regitered, pleae confirm your mail." });
    //recap, do proper jwt string
}
const loginUser = async (req, res) => {
    const { email, username, password, firstName, lastName } = req.body
    // res.send('Login User')
    if (!email || !password) {
        throw new CustomError.BadRequestError('Please provide E-mail and Password')
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    };

    if (!user.isActive) {
        throw new CustomError.BadRequestError('Your Account is Innactive pls contact your manager.')
    }

    if (!user.isEmailConfirmed) {
        throw new CustomError.UnauthenticatedError('Please confirm your email to login');
    }

    const passwordCorrect = await user.comparePassword(password);
    if (!passwordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    };
    const tokenUser = createUserToken(user);
    cookieToRes({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });
}
const logoutUser = async (req, res) => { //only remove the cookie
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    })
    res.status(StatusCodes.OK).json({ msg: 'user logOut' }) //dev propose only!!
}
const registerUserManager = async (req, res) => {
    const { email, username, password } = req.body
    const duplicatedEmail = await User.findOne({ email })
    if (duplicatedEmail) {
        throw new CustomError.BadRequestError('Email already in use')
    }

    // throw new CustomError.BadRequestError('Teste Only')
    //create user
    const role = 'manager'
    // const managerId = req.user.userID
    const user = await User.create({ 
        email, 
        username, 
        password, 
        role,
    })
    const tokenUser = createUserToken(user) //payload
    // const token = creatJWT({payload:tokenUser})
    cookieToRes({ res, user: tokenUser }) //cookie to response
    //console.log(user);
    res.status(StatusCodes.CREATED).json({ user: tokenUser })//recap, do proper jwt string
}

const confirmEmail = async (req, res) => {
    const { token } = req.query;
    const user = await User.findOne({ emailConfirmationToken: token });
    if (!user) {
        throw new CustomError.BadRequestError('Invalid Token');
    }

    user.isEmailConfirmed = true;
    user.emailConfirmationToken = undefined;
    await user.save();

    res.status(StatusCodes.OK).json({ msg: 'Email confirmed' });
};

const recoverPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError.NotFoundError('No user found with that email');
    }

    const passwordResetToken = crypto.randomBytes(20).toString('hex');
    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetPasswordURL = `${req.protocol}://${req.get('host')}/api/auth/reset-password?token=${passwordResetToken}`;
    await sendEmail({
        to: email,
        subject: 'Password Reset',
        text: `Please reset your password in the following link: ${resetPasswordURL}`,
    });

    res.status(StatusCodes.OK).json({ msg: 'Password reset link sent' });
};

const resetPassword = async (req, res) => {
    const { token } = req.query;
    const { password } = req.body;
    const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        throw new CustomError.BadRequestError('Invalid or expired token');
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(StatusCodes.OK).json({ msg: 'Password reset successful' });
};


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerUserManager,
    confirmEmail,
    recoverPassword,
    resetPassword,
    
}