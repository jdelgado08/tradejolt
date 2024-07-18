
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tradeSchema = Schema({

    accountId: {
        type: Schema.Types.ObjectId,
        ref : 'Account',
        required : true,
    },
    symbol : {
        type : String,
        required : [true, 'Please provide symbol of trade'],
    },
    tradeDate: {
        type : Date ,
        required : [true, 'Please provide date'],
    },
    entryTime: { 
        type: Date,
    },
     exitTime: { 
        type: Date,
    },
    entryPrice: { 
        type: Number,
        required : [true, 'Please provide entry price'],
    },
    exitPrice: { 
        type: Number,
        required : [true, 'Please provide exit price'],
    },
    size: { 
        type: Number, 
        required : [true, 'Please provide size'],
    },
    tradeType: { 
        type: String,
        enum: ['buy', 'short'], 
        required: true 
    },
    fees: { 
        type: Number, 
        required : [true, 'Please provide value of fees'],
    },
    notes: {
        type: String,
        maxlength : [1000, 'Max lenght 1000 characteres'],
    },
    image: {
        type: String,
        default: '/uploads/default.jpeg'
    },
    netProfitLoss: { 
        type: Number, 
        require : [true, 'Please provide value of net Profit or Loss'] 
    },
    platform: {
        type : String,
        default : 'Manual Entry'
    }
}, { timestamps: true });


tradeSchema.pre('deleteOne', { document: true, query: false }, async function(next) {

      const trade = this
      const Account = require('./Account'); // Lazy loading to avoid circular dependency
      const account = await Account.findById(trade.accountId)
      if (account) {
        const updateBalance = trade.netProfitLoss - trade.fees
        account.currentBalance -= updateBalance
        await account.save()
      }
      next()
  });


const Trade = mongoose.model('Trade', tradeSchema);
module.exports = Trade;
