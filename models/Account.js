
const mongoose = require ('mongoose')
const Schema = mongoose.Schema
const AccountBalance = require ('../models/AccountBalance')
const Trade = require('./Trade'); 
const CustomError = require('../errors/')

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

  accountSchema.post('save', async function (doc, next) {
    // console.log(doc.currentBalance);  
    await AccountBalance.create({
        accountId: doc._id,
        date: new Date(),
        balance: doc.currentBalance
      });

      next()
  })

  accountSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
      await Trade.deleteMany({ accountId: this._id })
      await AccountBalance.deleteMany({ accountId: this._id })
      next();
  });
const Account = mongoose.model('Account', accountSchema)

module.exports = Account