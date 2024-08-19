const Report = require('../models/Report');
const Account = require('../models/Account');
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors');
const { createDailyReport } = require('../utils/createReport');
const { checkPermissions } = require('../utils/checkPermissions');

//Get all reports based on role and accessible accounts
const getAllReports = async (req, res) => {

    const { reportType, startDate, endDate } = req.query;
    const query = {};

    if (req.accessibleAccounts) {
        query.accountId = { $in: req.accessibleAccounts };
    }

    //Apply report filters based on type, date range, etc.
    if (reportType) query.period = reportType;
    if (startDate && endDate) {
        query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const reports = await Report.find(query);

    res.status(StatusCodes.OK).json({ reports });
};


// Get reports for a specific account
const getAccountReport = async (req, res) => {
    const { accountId } = req.params;

    const account = await Account.findById(accountId);
    if (!account) {
        throw new CustomError.NotFoundError('Account not found');
    }

    // Check if the user has permission to access this account
    await checkPermissions(req.user, account.userId);

    const { reportType, startDate, endDate } = req.query;
    const query = { accountId };

    // Apply report filters based on type, date range, etc.
    if (reportType) query.period = reportType;
    if (startDate && endDate) {
        query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }


    const reports = await Report.find(query);

    res.status(StatusCodes.OK).json({ reports });

};

// Create a custom report using the existing daily report logic
const createCustomReport = async (req, res) => {
    const { accountId, startDate, endDate } = req.body;

    if (!accountId || !startDate || !endDate) {
        throw new CustomError.BadRequestError('AccountId, startDate, and endDate are required');
    }


    const report = await createDailyReport(accountId, startDate, endDate, 'custom');
    res.status(StatusCodes.CREATED).json({ report });

};

module.exports = {
    getAllReports,
    getAccountReport,
    createCustomReport,
};