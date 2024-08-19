const Trade = require('../models/Trade')
const AccountBalance = require('../models/AccountBalance');
const Report = require('../models/Report');
const Account = require('../models/Account');
const CustomError = require('../errors')
const User = require('../models/User');
const sendMail = require('./sendEmail');
const generateReportHTML = require('./generateReportHTML');
const sendReportEmail = require('./sendReportEmail');


//reports creation
// const createDailyReport = async (accountId, startDate, endDate, reportType = 'daily') => {

//   const account = await Account.findById(accountId);

//   //or account.isActive = false throw error
//   if (!account) {
//     throw new CustomError.NotFoundError(`Account with id ${accountId} not found`); 
//   };

//   const user = await User.findById(account.userId);
//   if (!user) {
//     throw new CustomError.NotFoundError(`User with id ${account.userId} not found`);
//   }

//   const trades = await Trade.find({
//     accountId,
//     tradeDate: { $gte: new Date(startDate), $lte: new Date(endDate) },

//   });

//   const totalTrades = trades.length;
//   const netPnL = trades.reduce((add, trade) => add + trade.netProfitLoss, 0);
//   const totalContracts = trades.reduce((add, trade) => add + trade.size, 0);
//   const totalFees = trades.reduce((sum, trade) => sum + trade.fees, 0);
//   //maybe cast straight before the report for now works.
//   const winningTrades = trades.filter(trade => trade.netProfitLoss > 0).length;
//   const losingTrades = trades.filter(trade => trade.netProfitLoss <= 0).length;

//   const winningTradesArray = trades.filter(trade => trade.netProfitLoss > 0);
//   const losingTradesArray = trades.filter(trade => trade.netProfitLoss <= 0);

//   const avgWinningTrade = winningTradesArray.length ? (winningTradesArray.reduce((sum, trade) => sum + trade.netProfitLoss, 0) / winningTradesArray.length) : 0;
//   const avgLosingTrade = losingTradesArray.length ? (losingTradesArray.reduce((sum, trade) => sum + trade.netProfitLoss, 0) / losingTradesArray.length) : 0;
//   const winningTradePercent = totalTrades ? (winningTradesArray.length / totalTrades) * 100 : 0;

//   const actualAccountBalance = await AccountBalance.findOne({ accountId }).sort({ date: -1 });

//   //throw error if can't find actual account balance

//   //test
//   // console.log(startDate + '-------------' + endDate);
//   // console.log(account.userId);
//   // console.log(totalTrades);
//   // console.log(netPnL);
//   // console.log(totalContracts);
//   // console.log(totalFees);
//   // console.log(winningTrades);
//   // console.log(losingTrades);
//   // console.log(avgWinningTrade);
//   // console.log(avgLosingTrade);
//   // console.log(winningTradePercent);
//   // console.log(actualAccountBalance.balance);

//   const summaryData = {
//     netPnL,
//     totalContracts,
//     totalFees,
//     totalTrades,
//     avgWinningTrade,
//     avgLosingTrade,
//     winningTradePercent,
//     totalAccountBalance: actualAccountBalance?.balance || 0
//   };


//   const report = new Report({
//     userId: account.userId,
//     accountId,
//     period: reportType,
//     date: new Date(endDate),
//     data: summaryData,
//     trades: trades.map(trade => trade._id)
//   });

//   await report.save();
//   //test env

 
//   const reportHTML = await generateReportHTML(account.accountName, reportType, summaryData, trades);
  
//   //test
//   // console.log('Summary Data:', summaryData);
//   // console.log('Trades:', trades);
  

//   if (account.emailReport) {
//     await sendReportEmail(user.email, account.accountName, reportType, reportHTML);
//     console.log(`Daily report generated for account ${accountId}`);
//   }

//   return report; //customReport need it.

  
// };



const createDailyReport = async (accountId, startDate, endDate, reportType = 'daily') => {

  const account = await Account.findById(accountId);
  if (!account) {
    throw new CustomError.NotFoundError(`Account with id ${accountId} not found`); 
  };

  const user = await User.findById(account.userId);
  if (!user) {
    throw new CustomError.NotFoundError(`User with id ${account.userId} not found`);
  }

  const trades = await Trade.find({
    accountId,
    tradeDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
  });

  const totalTrades = trades.length;
  const netPnL = trades.reduce((add, trade) => add + trade.netProfitLoss, 0);
  const totalContracts = trades.reduce((add, trade) => add + trade.size, 0);
  const totalFees = trades.reduce((sum, trade) => sum + trade.fees, 0);



  

 

  //calculate summary data
  const summaryData = {
    netPnL,
    totalContracts,
    totalFees,
    totalTrades,
    avgWinningTrade: trades.filter(t => t.netProfitLoss > 0).length ? trades.reduce((sum, trade) => sum + trade.netProfitLoss, 0) / trades.filter(t => t.netProfitLoss > 0).length : 0,
    avgLosingTrade: trades.filter(t => t.netProfitLoss <= 0).length ? trades.reduce((sum, trade) => sum + trade.netProfitLoss, 0) / trades.filter(t => t.netProfitLoss <= 0).length : 0,
    winningTradePercent: totalTrades ? trades.filter(t => t.netProfitLoss > 0).length / totalTrades * 100 : 0,
    totalAccountBalance: (await AccountBalance.findOne({ accountId }).sort({ date: -1 }))?.balance || 0,
  };


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

  //create and save report
  const report = new Report({
    userId: account.userId,
    accountId,
    period: reportType,
    date: new Date(endDate),
    data: summaryData,
    trades: trades.map(trade => trade._id),
  });

  await report.save();

  //generate HTML and send email if necessary

  const reportHTML = await generateReportHTML(account.accountName, reportType, summaryData, trades);
  if (account.emailReport) {
    const subject = `${reportType} Trade Report for Account: ${account.accountName}`;
    await sendReportEmail(user.email, subject, reportHTML);
  }

  //custom reports
  return report;
};


//weekly
const createWeeklyReport = async (accountId, startDate, endDate) => {

  const account = await Account.findById(accountId);
  if (!account) {
    throw new Error(`Account with id ${accountId} does not exist`);
  }

  const user = await User.findById(account.userId);
  if (!user) {
    throw new Error(`User with id ${account.userId} does not exist`);
  }

  const dailyReports = await Report.find({
    accountId,
    period: 'daily',
    date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  });

  const totalTrades = dailyReports.reduce((add, report) => add + report.data.totalTrades, 0);
  const netPnL = dailyReports.reduce((add, report) => add + report.data.netPnL, 0);
  const totalContracts = dailyReports.reduce((add, report) => add + report.data.totalContracts, 0);
  const totalFees = dailyReports.reduce((add, report) => add + report.data.totalFees, 0);

  // Calculate summary data
  const summaryData = {
    netPnL,
    totalContracts,
    totalFees,
    totalTrades,
    avgWinningTrade: dailyReports.length ? dailyReports.reduce((add, report) => add + report.data.avgWinningTrade, 0) / dailyReports.length : 0,
    avgLosingTrade: dailyReports.length ? dailyReports.reduce((add, report) => add + report.data.avgLosingTrade, 0) / dailyReports.length : 0,
    winningTradePercent: totalTrades ? dailyReports.reduce((add, report) => add + report.data.winningTradePercent, 0) / dailyReports.length : 0,
    totalAccountBalance: (await AccountBalance.findOne({ accountId }).sort({ date: -1 }))?.balance || 0,
  };

  //create and save weekly report
  const report = new Report({
    userId: account.userId,
    accountId,
    period: 'weekly',
    date: new Date(endDate),
    data: summaryData,
    dailyReports: dailyReports.map(report => report._id)
  });

  await report.save();

  //generate weekly report HTML and send email
  const reportHTML = await generateReportHTML(account.accountName, 'weekly', summaryData, [], dailyReports);
  if (account.emailReport) {
    await sendReportEmail(user.email, `Weekly Trade Report for Account: ${account.accountName}`, reportHTML);
  }

  return report;
};



// ----------------- Monthly

const createMonthlyReport = async (accountId, startDate, endDate) => {

  const account = await Account.findById(accountId);
  if (!account) {
    throw new Error(`Account with id ${accountId} does not exist`);
  }

  const user = await User.findById(account.userId);
  if (!user) {
    throw new Error(`User with id ${account.userId} does not exist`);
  }

  const weeklyReports = await Report.find({
    accountId,
    period: 'weekly',
    date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  });

  // Aggregate data for monthly summary
  const totalTrades = weeklyReports.reduce((add, report) => add + report.data.totalTrades, 0);
  const netPnL = weeklyReports.reduce((add, report) => add + report.data.netPnL, 0);
  const totalContracts = weeklyReports.reduce((add, report) => add + report.data.totalContracts, 0);
  const totalFees = weeklyReports.reduce((add, report) => add + report.data.totalFees, 0);

  // Calculate summary data
  const summaryData = {
    netPnL,
    totalContracts,
    totalFees,
    totalTrades,
    avgWinningTrade: weeklyReports.length ? weeklyReports.reduce((add, report) => add + report.data.avgWinningTrade, 0) / weeklyReports.length : 0,
    avgLosingTrade: weeklyReports.length ? weeklyReports.reduce((add, report) => add + report.data.avgLosingTrade, 0) / weeklyReports.length : 0,
    winningTradePercent: totalTrades ? weeklyReports.reduce((add, report) => add + report.data.winningTradePercent, 0) / weeklyReports.length : 0,
    totalAccountBalance: (await AccountBalance.findOne({ accountId }).sort({ date: -1 }))?.balance || 0,
  };

  // Create and save monthly report
  const report = new Report({
    userId: account.userId,
    accountId,
    period: 'monthly',
    date: new Date(endDate),
    data: summaryData,
    weeklyReports: weeklyReports.map(report => report._id)
  });

  await report.save();

  // Generate monthly report HTML and send email
  const reportHTML = await generateReportHTML(account.accountName, 'monthly', summaryData, [], [], weeklyReports);
  if (account.emailReport) {
    await sendReportEmail(user.email, `Monthly Trade Report for Account: ${account.accountName}`, reportHTML);
  }

  return report;
};



module.exports = {
  createDailyReport,
  createMonthlyReport,
  createWeeklyReport,
};