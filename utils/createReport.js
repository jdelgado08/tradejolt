const Trade = require('../models/Trade')
const AccountBalance = require('../models/AccountBalance');
const Report = require('../models/Report');
const Account = require('../models/Account');


const createDailyReport = async (accountId, startDate, endDate) =>{

    const account = await Account.findById(accountId);

    const trades = await Trade.find({
        accountId,
        tradeDate :{$gte: new Date(startDate), $lte: new Date(endDate)},

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

    

    //test
    console.log(account.userId);
    console.log(totalTrades);
    console.log(netPnL);
    console.log(totalContracts);
    console.log(totalFees);
    console.log(winningTrades);
    console.log(losingTrades);
    console.log(avgWinningTrade);
    console.log(avgLosingTrade);
    console.log(winningTradePercent);
    console.log(actualAccountBalance.balance);
   

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
};

const createWeeklyReport = async (accountId, startDate, endDate) =>{

};

const createMonthlyReport = async (accountId, startDate, endDate) =>{

};


module.exports = {
    createDailyReport,
    createMonthlyReport,
    createWeeklyReport,
};