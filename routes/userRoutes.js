const express = require('express')
const router = express.Router()

const {
    getAllUsers,
    getUser,
    showUser,
    updateUser,
    updateUserPassword,
    
} = require('../controllers/userController')

router.route('/').get(getAllUsers)

router.route('/showMe').get(showUser)//pay attention where to.
router.route('/updateUser').post(updateUser)
router.route('/updateUserPassword').patch(updateUserPassword)

router.route('/:id').get(getUser);



module.exports = router