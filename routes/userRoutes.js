const express = require('express')
const router = express.Router()
const {authenticateUser} = require('../middleware/authentication')
const {authrorizePermissions} = require('../middleware/permissions')

const {
    getAllUsers,
    getUser,
    showUser,
    updateUser,
    updateUserPassword,
    updateUserToManager,
    getManager,
    deleteUser,
    getAllUsersManager,


} = require('../controllers/userController')

//admin routes
router.route('/').get(authenticateUser, authrorizePermissions('admin') ,getAllUsers)
router.route('/updateUserToManager').patch(authenticateUser, authrorizePermissions('admin') ,updateUserToManager)
router.route('/:id').delete(authenticateUser,authrorizePermissions('admin'),deleteUser)

router.route('/manager/users').get(authenticateUser, authrorizePermissions('manager') ,getAllUsersManager)

//user routes
router.route('/showMe').get(authenticateUser, showUser)
router.route('/updateUser').patch(authenticateUser, updateUser)
router.route('/updateUserPassword').patch(authenticateUser,updateUserPassword)
router.route('/getManager').get(authenticateUser,getManager)

router.route('/:id').get(authenticateUser,getUser);



module.exports = router