//admin only
const getAllUsers = async (req,res) =>{
    res.send('get all Users')
}



const getUser = async (req,res) =>{
    res.send('get User')
}
const showUser = async (req,res) =>{
    res.send('Show User')
}
const updateUser = async (req,res) =>{
    res.send('Updt User')
}
const updateUserPassword = async (req,res) =>{
    res.send('Updt Pw')
}

module.exports = {
    getAllUsers,
    getUser,
    showUser,
    updateUser,
    updateUserPassword,

}