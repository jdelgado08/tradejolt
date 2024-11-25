const Trade = require('../models/Trade')
const AccountBalance = require('../models/AccountBalance');
const Report = require('../models/Report');
const Account = require('../models/Account');
const CustomError = require('../errors')
const User = require('../models/User');
const sendMail = require('./sendEmail');
const generateReportHTML = require('./generateReportHTML');
const sendReportEmail = require('./sendReportEmail');


const createDailyReport = async (accountId, startDate, endDate, reportType = 'daily') => {
  const account = await Account.findById(accountId);
  if (!account) {
      throw new CustomError.NotFoundError(`Account with id ${accountId} not found`);
  }

  const user = await User.findById(account.userId);
  if (!user) {
      throw new CustomError.NotFoundError(`User with id ${account.userId} not found`);
  }

  const trades = await Trade.find({
      accountId,
      tradeDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
  });

  console.log(`Fetched trades for account ${accountId}:`, trades);

  const totalTrades = trades.length;
  const netPnL = trades.reduce((add, trade) => add + trade.netProfitLoss, 0);
  const totalContracts = trades.reduce((add, trade) => add + trade.size, 0);
  const totalFees = trades.reduce((sum, trade) => sum + trade.fees, 0);

  const totalAccountBalance = await AccountBalance.findOne({ accountId }).sort({ date: -1 })?.balance || 0;

  const summaryData = {
      netPnL,
      totalContracts,
      totalFees,
      totalTrades,
      avgWinningTrade: trades.filter(t => t.netProfitLoss > 0).length
          ? trades.reduce((sum, trade) => sum + trade.netProfitLoss, 0) / trades.filter(t => t.netProfitLoss > 0).length
          : 0,
      avgLosingTrade: trades.filter(t => t.netProfitLoss <= 0).length
          ? trades.reduce((sum, trade) => sum + trade.netProfitLoss, 0) / trades.filter(t => t.netProfitLoss <= 0).length
          : 0,
      winningTradePercent: totalTrades
          ? (trades.filter(t => t.netProfitLoss > 0).length / totalTrades) * 100
          : 0,
      totalAccountBalance,
  };

  console.log('Summary Data:', summaryData);

  const report = new Report({
      userId: account.userId,
      accountId,
      period: reportType,
      date: new Date(endDate),
      data: summaryData,
      trades: trades.map(trade => trade._id),
  });

  console.log('Trades included in the report:', trades.map(trade => trade._id));
  await report.save();

  const reportHTML = await generateReportHTML(account.accountName, reportType, summaryData, trades);

  console.log('Trades passed to generateReportHTML:', trades);
  console.log('Generated HTML Content:', reportHTML);

  if (account.emailReport) {
      const subject = `${reportType} Trade Report for Account: ${account.accountName}`;
      await sendReportEmail(user.email, subject, reportHTML);
  }

  return report;
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

  const uniqueDailyReports = dailyReports.filter((report, index, self) =>
    index === self.findIndex((r) => r._id.toString() === report._id.toString())
  );

  if (uniqueDailyReports.length === 0) {
    console.log(`No daily reports found for account ${accountId} between ${startDate} and ${endDate}`);

    const summaryData = {
      netPnL: 0,
      totalContracts: 0,
      totalFees: 0,
      totalTrades: 0,
      avgWinningTrade: 0,
      avgLosingTrade: 0,
      winningTradePercent: 0,
      totalAccountBalance: (await AccountBalance.findOne({ accountId }).sort({ date: -1 }))?.balance || 0,
    };

    const reportHTML = await generateReportHTML(account.accountName, 'weekly', summaryData, [], []);
    if (account.emailReport) {
      await sendReportEmail(
        user.email,
        `Weekly Trade Report for Account: ${account.accountName}`,
        reportHTML
      );
    }
    return { message: "No daily reports found. Empty weekly report sent." };
  }

  const totalTrades = uniqueDailyReports.reduce((add, report) => add + report.data.totalTrades, 0);
  const netPnL = uniqueDailyReports.reduce((add, report) => add + report.data.netPnL, 0);
  const totalContracts = uniqueDailyReports.reduce((add, report) => add + report.data.totalContracts, 0);
  const totalFees = uniqueDailyReports.reduce((add, report) => add + report.data.totalFees, 0);

  const summaryData = {
    netPnL,
    totalContracts,
    totalFees,
    totalTrades,
    avgWinningTrade: uniqueDailyReports.length
      ? uniqueDailyReports.reduce((add, report) => add + report.data.avgWinningTrade, 0) / uniqueDailyReports.length
      : 0,
    avgLosingTrade: uniqueDailyReports.length
      ? uniqueDailyReports.reduce((add, report) => add + report.data.avgLosingTrade, 0) / uniqueDailyReports.length
      : 0,
    winningTradePercent: totalTrades
      ? uniqueDailyReports.reduce((add, report) => add + report.data.winningTradePercent, 0) / uniqueDailyReports.length
      : 0,
    totalAccountBalance: (await AccountBalance.findOne({ accountId }).sort({ date: -1 }))?.balance || 0,
  };

  const report = new Report({
    userId: account.userId,
    accountId,
    period: 'weekly',
    date: new Date(endDate),
    data: summaryData,
    dailyReports: uniqueDailyReports.map((report) => report._id),
  });

  await report.save();

  const reportHTML = await generateReportHTML(account.accountName, 'weekly', summaryData, [], uniqueDailyReports);
  if (account.emailReport) {
    await sendReportEmail(user.email, `Weekly Trade Report for Account: ${account.accountName}`, reportHTML);
  }

  return report;
};

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

  // Deduplicate weekly reports
  const uniqueWeeklyReports = weeklyReports.filter((report, index, self) =>
    index === self.findIndex((r) => r._id.toString() === report._id.toString())
  );

  if (uniqueWeeklyReports.length === 0) {
    console.log(`No weekly reports found for account ${accountId} between ${startDate} and ${endDate}`);

    const summaryData = {
      netPnL: 0,
      totalContracts: 0,
      totalFees: 0,
      totalTrades: 0,
      avgWinningTrade: 0,
      avgLosingTrade: 0,
      winningTradePercent: 0,
      totalAccountBalance: (await AccountBalance.findOne({ accountId }).sort({ date: -1 }))?.balance || 0,
    };

    const reportHTML = await generateReportHTML(account.accountName, 'monthly', summaryData, [], [], []);
    if (account.emailReport) {
      await sendReportEmail(
        user.email,
        `Monthly Trade Report for Account: ${account.accountName}`,
        reportHTML
      );
    }
    return { message: "No weekly reports found. Empty monthly report sent." };
  }

  // Aggregate data for monthly summary
  const totalTrades = uniqueWeeklyReports.reduce((add, report) => add + report.data.totalTrades, 0);
  const netPnL = uniqueWeeklyReports.reduce((add, report) => add + report.data.netPnL, 0);
  const totalContracts = uniqueWeeklyReports.reduce((add, report) => add + report.data.totalContracts, 0);
  const totalFees = uniqueWeeklyReports.reduce((add, report) => add + report.data.totalFees, 0);

  // Calculate summary data
  const summaryData = {
    netPnL,
    totalContracts,
    totalFees,
    totalTrades,
    avgWinningTrade: uniqueWeeklyReports.length
      ? uniqueWeeklyReports.reduce((add, report) => add + report.data.avgWinningTrade, 0) / uniqueWeeklyReports.length
      : 0,
    avgLosingTrade: uniqueWeeklyReports.length
      ? uniqueWeeklyReports.reduce((add, report) => add + report.data.avgLosingTrade, 0) / uniqueWeeklyReports.length
      : 0,
    winningTradePercent: totalTrades
      ? uniqueWeeklyReports.reduce((add, report) => add + report.data.winningTradePercent, 0) / uniqueWeeklyReports.length
      : 0,
    totalAccountBalance: (await AccountBalance.findOne({ accountId }).sort({ date: -1 }))?.balance || 0,
  };

  // Create and save monthly report
  const report = new Report({
    userId: account.userId,
    accountId,
    period: 'monthly',
    date: new Date(endDate),
    data: summaryData,
    weeklyReports: uniqueWeeklyReports.map((report) => report._id),
  });

  await report.save();

  // Generate monthly report HTML and send email
  const reportHTML = await generateReportHTML(account.accountName, 'monthly', summaryData, [], [], uniqueWeeklyReports);
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