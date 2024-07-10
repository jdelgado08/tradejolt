const express = require('express')
const router = express.Router()
const {authenticateUser} = require('../middleware/authentication')
const {authrorizePermissions} = require('../middleware/permissions')

const {
    registerUser,
    loginUser,
    logoutUser,
    registerUserManager,

} = require('../controllers/authController')

//admin
router.post('/registerManager',authenticateUser,authrorizePermissions('admin'),registerUserManager)

//noPermissons
router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/logout',logoutUser)

module.exports = router
