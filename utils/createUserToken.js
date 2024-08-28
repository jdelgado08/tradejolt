

const createUserToken = (user) =>{
    return {
        username : user.username,
        userId : user._id,
        role : user.role,
        firstName : user.firstName,
        lastName : user.lastName,  
        email : user.email,
    }
};

module.exports = {
    createUserToken,
    
}
