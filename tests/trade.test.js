const mongoose = require('mongoose');
const Trade = require('../models/Trade');
const Account = require('../models/Account');
const User = require('../models/User');

describe('Admin CRUD operations on Trade', () => {
  let account;
  let user;

  // Ensure MongoDB Memory Server starts fresh for each test suite
  beforeAll(async () => {
    user = await User.create({ username: 'AdminUser', isActive: true });
    account = await Account.create({
      userId: user._id,
      currentBalance: 1000,
      isActive: true,
      accountName: 'AdminAccount',
    });
  });

  afterEach(async () => {
    // Reset all trades after each test to avoid residual data issues
    await Trade.deleteMany({});
    await Account.updateOne({ _id: account._id }, { currentBalance: 1000 });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create a new trade and update account balance', async () => {
    const tradeData = {
      accountId: account._id,
      symbol: 'AAPL',
      tradeDate: new Date(),
      entryPrice: 150.5,
      exitPrice: 155.3,
      size: 10,
      tradeType: 'Long',
      fees: 2.5,
      netProfitLoss: 45,
    };

    const trade = await Trade.create(tradeData);
    expect(trade).toHaveProperty('_id');

    // Verify that the account balance is updated
    const updatedAccount = await Account.findById(account._id);
    console.log("Updated Account Balance (Create):", updatedAccount.currentBalance);
    expect(updatedAccount.currentBalance).toBe(1045); // 1000 + 45 - 2.5
  });

  it('should update a trade by ID and adjust the account balance', async () => {
    const trade = await Trade.create({
      accountId: account._id,
      symbol: 'AAPL',
      tradeDate: new Date(),
      entryPrice: 150.5,
      exitPrice: 155.3,
      size: 10,
      tradeType: 'Long',
      fees: 2.5,
      netProfitLoss: 45,
    });

    const updateData = { exitPrice: 160, netProfitLoss: 50 }; // Modify netProfitLoss
    await Trade.findByIdAndUpdate(trade._id, updateData, { new: true });

    const updatedAccount = await Account.findById(account._id);
    console.log("Updated Account Balance (Update):", updatedAccount.currentBalance);
    expect(updatedAccount.currentBalance).toBe(1050); // 1000 + 50 - 2.5
  });

  it('should delete a trade and revert account balance', async () => {
    const trade = await Trade.create({
      accountId: account._id,
      symbol: 'AAPL',
      tradeDate: new Date(),
      entryPrice: 150.5,
      exitPrice: 155.3,
      size: 10,
      tradeType: 'Long',
      fees: 2.5,
      netProfitLoss: 45,
    });

    await trade.deleteOne();

    const updatedAccount = await Account.findById(account._id);
    console.log("Updated Account Balance (Delete):", updatedAccount.currentBalance);
    expect(updatedAccount.currentBalance).toBe(1000); // Back to original balance
  });
});