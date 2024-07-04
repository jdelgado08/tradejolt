const jwt = require('jsonwebtoken')

const creatJWT = ({payload})=>{
    const token = jwt.sign(payload,process.env.JWT_STRING,{expiresIn: process.env.JWT_LIFESPAN})
    return token
}

const checkToken = ({ token}) => jwt.verify(token, process.env.JWT_STRING)

const cookieToRes = ({res, user}) =>{
    const token = creatJWT({payload : user})
    const day = 1000 * 60 * 60 * 24 //1day

    res.cookie('token', token, {
        httpOnly:true,
        expires: new Date(Date.now() + day),
        secure:process.env.NODE_ENV === 'production', //https issue
        signed :true,
    })
}

module.exports ={
    creatJWT,
    checkToken,
    cookieToRes,
}