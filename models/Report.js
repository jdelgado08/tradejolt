const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
  accountId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Account', 
    required: true 
},
  period: { 
        type: String,
        enum: ['daily', 'weekly', 'monthly'], 
        required: true 
},
data: { 
    totalTrades: { type: Number, required: true },
    winningTrades: { type: Number, required: true },
    losingTrades: { type: Number, required: true },
    netProfit: { type: Number, required: true },
    averageProfit: { type: Number, required: true },
    winRate: { type: Number, required: true },
    totalBalance: { type: Number, required: true }
  },
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
