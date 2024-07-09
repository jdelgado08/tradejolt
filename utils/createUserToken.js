

const createUserToken = (user) =>{
    return {
        username : user.username,
        userID : user._id,
        role : user.role,
        firstName : user.firstName,
        lastName : user.lastName,  
    }
};

module.exports = {
    createUserToken,
    
}
