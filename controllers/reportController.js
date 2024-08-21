const Report = require('../models/Report');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { getAccessibleAccounts } = require('../utils/checkPermissions');

const getAllReports = async (req, res) => {

    const { reportType, startDate, endDate } = req.query;
    const accessibleAccounts = await getAccessibleAccounts(req.user);

    const query = {};

    if (accessibleAccounts.length > 0) {
        query.accountId = { $in: accessibleAccounts };
    }

    if (reportType) query.period = reportType;
    if (startDate && endDate) {
        query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const reports = await Report.find(query);

    if (reports.length === 0) {
        return res.status(StatusCodes.OK).json({ msg: "No reports found." });
    }
    res.status(StatusCodes.OK).json({ reports });
};

const getAccountReport = async (req, res) => {
    const { accountId } = req.params;
    const { reportType, startDate, endDate } = req.query;

    await getAccessibleAccounts(req.user, accountId);

    const query = { accountId };
    if (reportType) query.period = reportType;
    if (startDate && endDate) {
        query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const reports = await Report.find(query);

    if (reports.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: 'No reports found' });
    }

    res.status(StatusCodes.OK).json({ reports });
};


const createCustomReport = async (req, res) => {
    const { accountId, startDate, endDate } = req.body;

    if (!accountId || !startDate || !endDate) {
        throw new CustomError.BadRequestError('AccountId, startDate, and endDate are required');
    }

    await getAccessibleAccounts(req.user, accountId);

    const report = await createDailyReport(accountId, startDate, endDate, 'custom');
    res.status(StatusCodes.CREATED).json({ report });
};

module.exports = {
    getAllReports,
    getAccountReport,
    createCustomReport,
};
