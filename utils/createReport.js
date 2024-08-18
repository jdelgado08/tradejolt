const Trade = require('../models/Trade')
const AccountBalance = require('../models/AccountBalance');
const Report = require('../models/Report');
const Account = require('../models/Account');
const CustomError = require('../errors')
const User = require('../models/User');
const sendMail = require('./sendEmail');
const generateReportHTML = require('./generateReportHTML');
const sendReportEmail = require('./sendReportEmail');



// const generateReportHTML = (accountName, reportType, summaryData, trades) => {
//   const tradesContent = trades.map(trade => `
//     <tr>
//       <td>${trade.symbol}</td>
//       <td>${trade.tradeDate}</td>
//       <td>${trade.entryPrice}</td>
//       <td>${trade.exitPrice}</td>
//       <td>${trade.netProfitLoss}</td>
//     </tr>`).join('');

//   return `
//     <html>
//       <body>
//         <h1>${reportType} Trade Report for Account: ${accountName}</h1>
//         <table border="1">
//           <thead>
//             <tr>
//               <th>Net PnL</th>
//               <th>Total Contracts</th>
//               <th>Total Fees</th>
//               <th>Total Trades</th>
//               <th>Avg Winning Trade</th>
//               <th>Avg Losing Trade</th>
//               <th>Winning Trade Percent</th>
//               <th>Total Account Balance</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>${summaryData.netPnL}</td>
//               <td>${summaryData.totalContracts}</td>
//               <td>${summaryData.totalFees}</td>
//               <td>${summaryData.totalTrades}</td>
//               <td>${summaryData.avgWinningTrade}</td>
//               <td>${summaryData.avgLosingTrade}</td>
//               <td>${summaryData.winningTradePercent}</td>
//               <td>${summaryData.totalAccountBalance}</td>
//             </tr>
//           </tbody>
//         </table>
//         <h2>Trades:</h2>
//         <table border="1">
//           <thead>
//             <tr>
//               <th>Symbol</th>
//               <th>Trade Date</th>
//               <th>Entry Price</th>
//               <th>Exit Price</th>
//               <th>Net Profit/Loss</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${tradesContent}
//           </tbody>
//         </table>
//       </body>
//     </html>`;
// };

// // Helper Function for Sending Email
// const sendReportEmail = async (userEmail, accountName, reportType, reportHTML) => {
//   const mailOptions = {
//     to: userEmail,
//     subject: `${reportType} Trade Report for Account: ${accountName}`,
//     text: `Please find the attached ${reportType.toLowerCase()} trade report for your account: ${accountName}.`,
//     html: reportHTML,
//   };

//   await sendMail(mailOptions);
// };




//reports creation
const createDailyReport = async (accountId, startDate, endDate) => {

  const account = await Account.findById(accountId);

  //or account.isActive = false throw error
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

  const summaryData = {
    netPnL,
    totalContracts,
    totalFees,
    totalTrades,
    avgWinningTrade,
    avgLosingTrade,
    winningTradePercent,
    totalAccountBalance: actualAccountBalance?.balance || 0
  };


  const report = new Report({
    userId: account.userId,
    accountId,
    period: 'daily',
    date: new Date(endDate),
    data: summaryData,
    trades: trades.map(trade => trade._id)
  });

  await report.save();
  //test env

 
  const reportHTML = generateReportHTML(account.accountName, 'Daily', summaryData, trades);

  if (account.emailReport) {
    await sendReportEmail(user.email, account.accountName, 'Daily', reportHTML);
    console.log(`Daily report generated for account ${accountId}`);
  }

  
};

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

  const summaryData = {
    netPnL,
    totalContracts,
    totalFees,
    totalTrades,
    avgWinningTrade,
    avgLosingTrade,
    winningTradePercent,
    totalAccountBalance: actualAccountBalance?.balance || 0
  };

  const report = new Report({
    userId: account.userId,
    accountId,
    period: 'weekly',
    date: new Date(endDate),
    data: summaryData,
    dailyReports: dailyReports.map(report => report._id)
});

await report.save();

const reportHTML = await generateReportHTML(account.accountName, 'Weekly', summaryData, []); //[] cause is a summary, so no need of actually pass the trades.

if (account.emailReport) {
  await sendReportEmail(user.email, account.accountName, 'Weekly', reportHTML);
  console.log(`Weekly report generated for account ${accountId}`);
}

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

  const summaryData = {
    netPnL,
    totalContracts,
    totalFees,
    totalTrades,
    avgWinningTrade,
    avgLosingTrade,
    winningTradePercent,
    totalAccountBalance: actualAccountBalance?.balance || 0
  };

  const report = new Report({
    userId: account.userId,
    accountId,
    period: 'weekly',
    date: new Date(endDate),
    data:summaryData,
    weeklyReports: weeklyReports.map(report => report._id)
});

await report.save();

const reportHTML = await generateReportHTML(account.accountName, 'Monthly', summaryData, []);

if (account.emailReport) {
  await sendReportEmail(user.email, account.accountName, 'Monthly', reportHTML);
  console.log(`Monthly report generated for account ${accountId}`);
}

};


module.exports = {
  createDailyReport,
  createMonthlyReport,
  createWeeklyReport,
};