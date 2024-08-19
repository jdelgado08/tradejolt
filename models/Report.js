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
    enum: ['daily', 'weekly', 'monthly', 'custom'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  data: {
    netPnL: { type: Number, required: true },
    totalContracts: { type: Number, required: true },
    totalFees: { type: Number, required: true },
    totalTrades: { type: Number, required: true },
    avgWinningTrade: { type: Number, required: true },
    avgLosingTrade: { type: Number, required: true },
    winningTradePercent: { type: Number, required: true },
    totalAccountBalance: { type: Number, required: true }
  },
  trades: [{
    type: Schema.Types.ObjectId, //daily
    ref: 'Trade',
  }],
  dailyReports: [{
    type: Schema.Types.ObjectId, //weekly
    ref: 'Report'
  }],
  weeklyReports: [{
    type: Schema.Types.ObjectId, //monthly
    ref: 'Report'
  }]
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
