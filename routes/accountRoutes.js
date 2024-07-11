const express = require('express')
const router = express.Router()
const { authenticateUser } = require('../middleware/authentication')
const { authrorizePermissions } = require('../middleware/permissions')

const {

    createAccount,
    getAllAccountsUser,
    getAccount,
    updateAccount,
    deleteAccount,
    getAllAccounts


} = require('../controllers/accountController')



router.route('/').post(authenticateUser, createAccount)
//pick id from cookie
router.route('/allUserAccounts').get(authenticateUser, getAllAccountsUser)
//order
router.route('/all').get(authenticateUser, authrorizePermissions('admin'), getAllAccounts)
router.route('/:id')
    .get(authenticateUser, getAccount)
    .patch(authenticateUser, updateAccount)

router.route('/:id').delete(authenticateUser, authrorizePermissions('admin'), deleteAccount)









module.exports = router