const Trade = require('../models/Trade')
const Account = require('../models/Account')
const User = require('../models/User')
const ExcelJS = require('exceljs');
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const {
  checkPermissions,
  checkUserPermissions,

} = require('../utils')

//create a trade entry (only the userId associated with this Account can use this route)
const createTrade = async (req, res) => {

  const accountId = req.params.id;
  const {
    symbol,
    tradeDate,
    entryTime,
    exitTime,
    entryPrice,
    exitPrice,
    size,
    tradeType,
    fees,
    notes,
    image,
    netProfitLoss,

  } = req.body;

  const account = await Account.findById(accountId)

  if (!account) {
    throw new CustomError.NotFoundError(`Account with id: ${accountId} wasn't found`)
  }

  checkUserPermissions(req.user, account.userId)

  const castEntryTime = new Date(`${tradeDate}T${entryTime}Z`)
  const castExitTime = new Date(`${tradeDate}T${exitTime}Z`)

  const tradeEntry = await Trade.create({
    accountId,
    symbol,
    tradeDate: new Date(tradeDate),
    entryTime: castEntryTime,
    exitTime: castExitTime,
    entryPrice,
    exitPrice,
    size,
    tradeType,
    fees,
    notes,
    image,
    netProfitLoss,

  })

  const updateBalance = netProfitLoss - fees
  account.currentBalance += updateBalance

  await account.save()

  res.status(StatusCodes.CREATED).json(tradeEntry)
}
//get all trade entry from an Account (accountId)
const getAllTradesAccount = async (req, res) => {

  const accountId = req.params.accountId //Account Id to get all entrys

  const account = await Account.findById(accountId)
  if (!account) {
    throw new CustomError.NotFoundError(`Account with id: ${accountId} wasn't found`)
  }

  await checkPermissions(req.user, account.userId)

  const allEntrys = await Trade.find({ accountId })

  res.status(StatusCodes.OK).json({ TradingEntrys: allEntrys })

}
const getTrade = async (req, res) => {
  const tradeId = req.params.id

  const tradeEntry = await Trade.findById(tradeId)

  if (!tradeEntry) {
    throw new CustomError.NotFoundError(`Trade entry with id: ${tradeId} wasn't found`)
  }

  const account = await Account.findById(tradeEntry.accountId)

  await checkPermissions(req.user, account.userId)

  res.status(StatusCodes.OK).json({ TradingEntry: tradeEntry })

}
const updateTrade = async (req, res) => {

  const { id } = req.params // Trade entry ID to be updated

  const {
    symbol,
    tradeDate,
    entryTime,
    exitTime,
    entryPrice,
    exitPrice,
    size,
    tradeType,
    fees,
    notes,
    image,
    netProfitLoss,
  } = req.body


  // console.log(req.body);
  // Find the trade by ID
  const trade = await Trade.findById(id);
  if (!trade) {
    throw new CustomError.NotFoundError(`Trade with id: ${id} wasn't found`);
  }

  // Find the account associated with the trade
  const account = await Account.findById(trade.accountId);
  if (!account) {
    throw new CustomError.NotFoundError(`Account with id: ${trade.accountId} wasn't found`);
  }

  // Check if the requesting user is the owner of the account
  checkUserPermissions(req.user, account.userId);

  //account ID stays the same, a trade only has meaning associated with the account, if somehow acounttrade was choosen incorrect at creation user should delete the entry.
  trade.symbol = symbol !== undefined ? symbol : trade.symbol;
  trade.tradeDate = tradeDate !== undefined ? new Date(tradeDate) : trade.tradeDate;
  trade.entryTime = entryTime !== undefined ? new Date(`${tradeDate}T${entryTime}Z`) : trade.entryTime;
  trade.exitTime = exitTime !== undefined ? new Date(`${tradeDate}T${exitTime}Z`) : trade.exitTime;
  trade.entryPrice = entryPrice !== undefined ? entryPrice : trade.entryPrice;
  trade.exitPrice = exitPrice !== undefined ? exitPrice : trade.exitPrice;
  trade.size = size !== undefined ? size : trade.size;
  trade.tradeType = tradeType !== undefined ? tradeType : trade.tradeType;
  trade.notes = notes !== undefined ? notes : trade.notes;
  trade.image = image !== undefined ? image : trade.image;

  //save old netProfitloss
  const oldNetProfitLoss = trade.netProfitLoss;
  trade.netProfitLoss = netProfitLoss !== undefined ? netProfitLoss : trade.netProfitLoss

  //save old fees
  const oldFees = trade.fees
  trade.fees = fees !== undefined ? fees : trade.fees

  const updateBalance = (trade.netProfitLoss - trade.fees) - (oldNetProfitLoss - oldFees)
  account.currentBalance += updateBalance

  await account.save()
  await trade.save()

  res.status(StatusCodes.OK).json(trade);
}
const deleteTrade = async (req, res) => {

  const { id } = req.params

  const trade = await Trade.findById(id)
  if (!trade) {
    throw new CustomError.NotFoundError(`Trade with id: ${id} wasn't found`)
  }

  const account = await Account.findById(trade.accountId)

  if (!account) {
    throw new CustomError.NotFoundError(`Account with id: ${trade.accountId} wasn't found`);
  }

  await checkPermissions(req.user, account.userId)
  await trade.deleteOne();

  res.status(StatusCodes.OK).json({ message: 'Trade deleted successfully' });
}
//Admin
const getAllTrades = async (req, res) => {

  //All accounts and populate user details
  const accounts = await Account.find()
    .populate({
      path: 'userId',
      select: 'username',
    })
    .select('accountName userId currentBalance');

  // Fetch all trades
  const trades = await Trade.find()
    .populate({
      path: 'accountId',
      select: 'accountName userId',
      populate: {
        path: 'userId',
        select: 'username',
      },
    })
    .select('-__v -createdAt -updatedAt');

  //Initialize result with accounts and their balances
  const result = {};

  accounts.forEach(account => {
    const { userId, accountName, currentBalance } = account;
    const { username } = userId;

    if (!result[username]) {
      result[username] = {};
    }

    if (!result[username][accountName]) {
      result[username][accountName] = {
        balance: currentBalance,
        trades: ['No trades taken'],
      };
    }
  });

  // Add trades to the result
  trades.forEach(trade => {
    const { userId, accountName, currentBalance } = trade.accountId;
    const { username } = userId;

    // Initialize if not already initialized
    if (!result[username]) {
      result[username] = {};
    }

    if (!result[username][accountName]) {
      result[username][accountName] = {
        balance: currentBalance,
        trades: [],
      };
    } else {
      // If trades array contains 'No trades taken', remove it
      if (result[username][accountName].trades.includes('No trades taken')) {
        result[username][accountName].trades = [];
      }
    }

    // Extract only the necessary trade information
    const tradeInfo = {
      _id: trade._id,
      symbol: trade.symbol,
      tradeDate: trade.tradeDate,
      entryTime: trade.entryTime,
      exitTime: trade.exitTime,
      entryPrice: trade.entryPrice,
      exitPrice: trade.exitPrice,
      size: trade.size,
      tradeType: trade.tradeType,
      fees: trade.fees,
      notes: trade.notes,
      image: trade.image,
      netProfitLoss: trade.netProfitLoss,
    };

    result[username][accountName].trades.push(tradeInfo);
  });

  res.status(StatusCodes.OK).json(result);

}
const getAllTradeEntryManager = async (req, res) => {

  const managerId = req.user.userId;
  console.log(managerId);

  // Find all users managed by the logged-in manager
  const managedUsers = await User.find({ managerId: managerId }).select('_id');
  const managedUserIds = managedUsers.map(user => user._id);

  if (managedUserIds.length === 0) {
    throw new CustomError.NotFoundError('No users found');
  }

  // Aggregation pipeline
   const pipeline = [
      { $match: { userId: { $in: managedUserIds } } },
      { $lookup: { from: 'trades', localField: '_id', foreignField: 'accountId', as: 'trades' } },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: '$trades' },
      { $unwind: '$user' },
      { $group: { _id: '$accountName', user: { $first: '$user.username' }, trades: { $push: '$trades' } } },
      { $project: { _id: 0, accountName: '$_id', user: 1, trades: 1 } }
    ];

  const tradesByAccount = await Account.aggregate(pipeline);
  res.status(StatusCodes.OK).json({ tradesByAccount });
  
}

//upload am excell File and create trady entrys based on that
const uploadTradesExcell = async (req, res) => {

  const { accountId } = req.params;

  // file updated?
  if (!req.files || !req.files.file) {
    throw new CustomError.BadRequestError('File not found');
  };

  const file = req.files.file;
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file.data);
  const worksheet = workbook.worksheets[0];

  const jsonData = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; //skip header
    const rowData = {
      accountId,
      notes: row.getCell(1).value,
      symbol: row.getCell(2).value,
      entryTime: new Date(row.getCell(3).value),
      exitTime: new Date(row.getCell(4).value),
      entryPrice: parseFloat(row.getCell(5).value),
      exitPrice: parseFloat(row.getCell(6).value),
      fees: parseFloat(row.getCell(7).value),
      netProfitLoss: parseFloat(row.getCell(8).value),
      size: parseInt(row.getCell(9).value, 10),
      tradeType: row.getCell(10).value,
      tradeDate: new Date(row.getCell(11).value),
      platform: 'TopstepX', //add auto after, let as example
    };
    jsonData.push(rowData);
  });

  for (const row of jsonData) {
    const trade = new Trade(row);


    const account = await Account.findById(trade.accountId);
    if (!account) {
      throw new CustomError.NotFoundError(`Account with id: ${trade.accountId} wasn't found`);
    }

    checkUserPermissions(req.user, account.userId);

    await trade.save();

    // Update account balance
    account.currentBalance += trade.netProfitLoss - trade.fees;
    await account.save();
  }

  res.status(StatusCodes.CREATED).send('Trades imported successfully');
  // res.status(StatusCodes.CREATED).json({ jsonData });

};

module.exports = {
  createTrade,
  getAllTradesAccount,
  getTrade,
  updateTrade,
  deleteTrade,
  getAllTrades,
  uploadTradesExcell,
  getAllTradeEntryManager,

}