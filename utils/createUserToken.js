

const createUserToken = (user) =>{
    return {
        username : user.username,
        userId : user._id,
        role : user.role,
        firstName : user.firstName,
        lastName : user.lastName,  
    }
};

module.exports = {
    createUserToken,
    
}
