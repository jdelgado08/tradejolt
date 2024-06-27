const mongoose = require('mongoose')
const validator = require('validator')


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
    first_name: { type: String, default: 'First Name' },
    last_name: { type: String, default: 'Last Name' },
    // // created_at:{},
    // created_at:{},
})

const User = mongoose.model('User', userSchema)
module.exports = User;
