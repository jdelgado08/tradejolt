
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
    isActive : {
        type : Boolean,
        default : true,
    },
},{timestamps : true})

accountSchema.pre('save', function (next) {
    if (this.currentBalance < 0) {
      this.isActive = false;

      next(); //keep the operation, to make sure we have the rioght balances, we lock the account on the post hook
    } else {
      next();
    }
  });
  
  accountSchema.post('save', async function (doc, next) {
    await AccountBalance.create({
      accountId: doc._id,
      date: new Date(),
      balance: doc.currentBalance
    });
  
    // If the balance is negative, throw an error after saving the balance
    if (doc.currentBalance < 0) {
      next(new CustomError.BadRequestError("The Balance of your Account is under 0, your account will be deactivated, speak with your Manager/Admin for more details"));
    } else {
      next();
    }
  });

// accountSchema.pre('save', function (next) {
//     if (this.currentBalance < 0) {
//         this.isActive = false;
//         //to make sure the balance update
//         next( new CustomError.BadRequestError("The Balance of your Account is under 0, your account will be desactivated, speak with your Manager/Admin for more details"));
//     } else {
//         next();
//     }
    
//   });

//   accountSchema.post('save', async function (doc, next) {
//     // console.log(doc.currentBalance);  
//     await AccountBalance.create({
//         accountId: doc._id,
//         date: new Date(),
//         balance: doc.currentBalance
//       });

//       next()
//   })

  accountSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
      await Trade.deleteMany({ accountId: this._id })
      await AccountBalance.deleteMany({ accountId: this._id })
      next();
  });
const Account = mongoose.model('Account', accountSchema)

module.exports = Account