const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountBalanceSchema = new Schema({
  accountId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Account', 
    required: true 
},
  date: { 
    type: Date, 
    require: [true, 'Please provide date!']
},
  balance: { 
    type: Number, 
    required: true 
}
}, { timestamps: true });

const AccountBalance = mongoose.model('AccountBalance', accountBalanceSchema);
module.exports = AccountBalance;

