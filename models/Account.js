
const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const accountSchema = Schema ({
    //reff to userId
    userId:{
        type : Schema.Types.ObjectId,
        ref : 'User',
        require: true,
    },
    accountName: {
        type : String,
        require: [true, 'Please provide Account Name!']
    },
    initialBalance: {
        type : Number,
        require: [true, 'Please provide amount for initial Balance'],        
    },
    currentBalance: {
        type : Number,
        require: [true, 'Please provide amount for current Balance'],
    },
},{timestamps : true})

accountSchema.pre('save', function (next) {
    if (this.currentBalance < 0) {
        throw new CustomError.BadRequestError("Not enoth balance, can't go below 0")
    }
    next();
  });

const Account = mongoose.model('Account', accountSchema)
module.exports = Account;