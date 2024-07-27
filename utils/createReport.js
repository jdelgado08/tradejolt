const Trade = require('../models/Trade')
const AccountBalance = require('../models/AccountBalance');
const Report = require('../models/Report');
const Account = require('../models/Account');
const CustomError = require('../errors')


const createDailyReport = async (accountId, startDate, endDate) => {

  const account = await Account.findById(accountId);

  if (!account) {
    throw new CustomError.NotFoundError(`Account with id ${accountId} not found`); 
  };

  const trades = await Trade.find({
    accountId,
    tradeDate: { $gte: new Date(startDate), $lte: new Date(endDate) },

  });

  const totalTrades = trades.length;
  const netPnL = trades.reduce((add, trade) => add + trade.netProfitLoss, 0);
  const totalContracts = trades.reduce((add, trade) => add + trade.size, 0);
  const totalFees = trades.reduce((sum, trade) => sum + trade.fees, 0);
  //maybe cast straight before the report for now works.
  const winningTrades = trades.filter(trade => trade.netProfitLoss > 0).length;
  const losingTrades = trades.filter(trade => trade.netProfitLoss <= 0).length;

  const winningTradesArray = trades.filter(trade => trade.netProfitLoss > 0);
  const losingTradesArray = trades.filter(trade => trade.netProfitLoss <= 0);

  const avgWinningTrade = winningTradesArray.length ? (winningTradesArray.reduce((sum, trade) => sum + trade.netProfitLoss, 0) / winningTradesArray.length) : 0;
  const avgLosingTrade = losingTradesArray.length ? (losingTradesArray.reduce((sum, trade) => sum + trade.netProfitLoss, 0) / losingTradesArray.length) : 0;
  const winningTradePercent = totalTrades ? (winningTradesArray.length / totalTrades) * 100 : 0;

  const actualAccountBalance = await AccountBalance.findOne({ accountId }).sort({ date: -1 });

  //throw error if can't find actual account balance

  //test
  // console.log(startDate + '-------------' + endDate);
  // console.log(account.userId);
  // console.log(totalTrades);
  // console.log(netPnL);
  // console.log(totalContracts);
  // console.log(totalFees);
  // console.log(winningTrades);
  // console.log(losingTrades);
  // console.log(avgWinningTrade);
  // console.log(avgLosingTrade);
  // console.log(winningTradePercent);
  // console.log(actualAccountBalance.balance);


  const report = new Report({
    userId: account.userId,
    accountId,
    period: 'daily',
    date: new Date(endDate),
    data: {
      netPnL,
      totalContracts,
      totalFees,
      totalTrades,
      avgWinningTrade,
      avgLosingTrade,
      winningTradePercent,
      totalAccountBalance: actualAccountBalance?.balance || 0
    },
    trades: trades.map(trade => trade._id)
  });

  await report.save();
  //test env
  console.log(`Daily report generated for account ${accountId}`);
};

const createWeeklyReport = async (accountId, startDate, endDate) => {

  const account = await Account.findById(accountId);
  if (!account) {
    throw new Error(`Account with id ${accountId} does not exist`);
  }

  const dailyReports = await Report.find({
    accountId,
    period: 'daily',
    date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  });


  const totalTrades = dailyReports.reduce((add, report) => add + report.data.totalTrades, 0);
  const netPnL = dailyReports.reduce((add, report) => add + report.data.netPnL,0);
  const totalContracts = dailyReports.reduce((add, report) => add + report.data.totalContracts,0);
  const totalFees =dailyReports.reduce((add, report) => add + report.data.totalFees,0);
  const avgWinningTrade = dailyReports.length ? (dailyReports.reduce((add, report) => add + report.data.avgWinningTrade, 0) / dailyReports.length) : 0;
  const avgLosingTrade = dailyReports.length ? (dailyReports.reduce((add, report) => add + report.data.avgLosingTrade, 0) / dailyReports.length) : 0;
  const winningTradePercent = totalTrades ? (dailyReports.reduce((add, report) => add + report.data.winningTradePercent, 0) / dailyReports.length) : 0;

  const actualAccountBalance = await AccountBalance.findOne({ accountId }).sort({ date: -1 });

  //testing
  // console.log(`Daily Reports Lenght ${dailyReports.length}:  `+ dailyReports);
  // console.log(totalTrades);
  // console.log(netPnL);
  // console.log(totalContracts);
  // console.log(totalFees);
  // console.log(avgWinningTrade);
  // console.log(avgLosingTrade);
  // console.log(winningTradePercent);
  // console.log(actualAccountBalance.balance);


  const report = new Report({
    userId: account.userId,
    accountId,
    period: 'weekly',
    date: new Date(endDate),
    data: {
        netPnL,
        totalContracts,
        totalFees,
        totalTrades,
        avgWinningTrade,
        avgLosingTrade,
        winningTradePercent,
        totalAccountBalance: (actualAccountBalance?.balance || 0).toFixed(2),
    },
    dailyReports: dailyReports.map(report => report._id)
});

await report.save();
//test env
console.log(`Weekly report generated for account ${accountId}`);

};

const createMonthlyReport = async (accountId, startDate, endDate) => {

  const account = await Account.findById(accountId);
  if (!account) {
    throw new Error(`Account with id ${accountId} does not exist`);
  }

  const weeklyReports = await Report.find({
    accountId,
    period: 'weekly',
    date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  });


  const totalTrades = weeklyReports.reduce((add, report) => add + report.data.totalTrades, 0);
  const netPnL = weeklyReports.reduce((add, report) => add + report.data.netPnL,0);
  const totalContracts = weeklyReports.reduce((add, report) => add + report.data.totalContracts,0);
  const totalFees =weeklyReports.reduce((add, report) => add + report.data.totalFees,0);
  const avgWinningTrade = weeklyReports.length ? (weeklyReports.reduce((add, report) => add + report.data.avgWinningTrade, 0) / weeklyReports.length) : 0;
  const avgLosingTrade = weeklyReports.length ? (weeklyReports.reduce((add, report) => add + report.data.avgLosingTrade, 0) / weeklyReports.length) : 0;
  const winningTradePercent = totalTrades ? (weeklyReports.reduce((add, report) => add + report.data.winningTradePercent, 0) / weeklyReports.length) : 0;

  const actualAccountBalance = await AccountBalance.findOne({ accountId }).sort({ date: -1 });

  //testing
  // console.log(`Weekly Reports Lenght ${weeklyReports.length}:  `+ weeklyReports);
  // console.log(totalTrades);
  // console.log(netPnL);
  // console.log(totalContracts);
  // console.log(totalFees);
  // console.log(avgWinningTrade);
  // console.log(avgLosingTrade);
  // console.log(winningTradePercent);
  // console.log(actualAccountBalance.balance);


  const report = new Report({
    userId: account.userId,
    accountId,
    period: 'weekly',
    date: new Date(endDate),
    data: {
        netPnL,
        totalContracts,
        totalFees,
        totalTrades,
        avgWinningTrade,
        avgLosingTrade,
        winningTradePercent,
        totalAccountBalance: (actualAccountBalance?.balance || 0).toFixed(2),
    },
    weeklyReports: weeklyReports.map(report => report._id)
});

await report.save();
//test env
console.log(`Monthly report generated for account ${accountId}`);

};


module.exports = {
  createDailyReport,
  createMonthlyReport,
  createWeeklyReport,
};