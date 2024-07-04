const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema


const userSchema = Schema({
    username: { type: String, required: [true, 'Please provide username!'], unique: true, minlength: 5, maxlength: 30, trim: true },
    //valid with package {name}
    email: {
        type: String, require: [true, 'Please provide email!'], unique: true, trim: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email',
        },
    },
    password: { type: String, require: [true, 'Please provide password!'], minlength: 8 },
    role : { type: String, enum : ['admin', 'user'], default: 'user'},
    first_name: { type: String, default: 'First Name' },
    last_name: { type: String, default: 'Last Name' },
    // // created_at:{},
    // created_at:{},
})

userSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt) //hashing
})

userSchema.methods.comparePassword = async function(tempPassword){
    const matchPassword = await bcrypt.compare(tempPassword, this.password)
    return matchPassword
}

const User = mongoose.model('User', userSchema)
module.exports = User;
