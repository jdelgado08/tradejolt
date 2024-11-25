const cron = require('node-cron');
const CustomError = require('../errors')
//test
const ErrorGeneratingReport = require('../errors/error-report')
const moment = require('moment');
const Account = require('../models/Account');
const {
    createDailyReport,
    createWeeklyReport,
    createMonthlyReport,
} = require('./createReport');


//for test */1 * * * *

//daily report  every 23:59 - Monday to Friday. 59 23 * * 1-5  
cron.schedule('59 23 * * 1-5 ', async () => {
    try {
        console.log('Daily report cron job triggered');
        //previous day
        const startDate = moment().subtract(1, 'day').startOf('day').toISOString();
        const endDate = moment().subtract(1, 'day').endOf('day').toISOString();

        const accounts = await Account.find({});
        if (!accounts) {
            throw new CustomError.NotFoundError(`No accounts were found.`);
        };

        for (const account of accounts) {
            // console.log(account._id);
            await createDailyReport(account._id, startDate, endDate);
        };

    } catch (error) {
        throw new CustomError.ErrorGeneratingReport('An error occurred. Cannot generate the DAILY report.');
    }
});

//weekly report every saturday at 23:59 ---59 23 * * 6
cron.schedule('59 23 * * 6', async () => {
    try {
        console.log('Weekly report cron job triggered');
        //previous week
        const endDate = moment().day(6).subtract(1, 'week').endOf('day').toISOString();
        const startDate = moment(endDate).subtract(6, 'days').startOf('day').toISOString();

        const accounts = await Account.find({});
        if (!accounts) {
            throw new CustomError.NotFoundError(`No accounts were found.`);
        };

        for (const account of accounts) {
            await createWeeklyReport(account._id, startDate, endDate);
        };

    } catch (error) {
        throw new CustomError.ErrorGeneratingReport('An error occurred. Cannot generate the WEEKLY report.');
    }
});

//monthly report every 1st sunday of month ---59 23 1-7 * 0
cron.schedule('59 23 1-7 * 0', async () => {
    try {
        console.log('Monthly report cron job triggered');
        //previous month
        const startDate = moment().subtract(1, 'month').startOf('month').toISOString();
        const endDate = moment().subtract(1, 'month').endOf('month').toISOString();
        

        const accounts = await Account.find({});
        if (!accounts) {
            throw new CustomError.NotFoundError(`No accounts were found.`);
        };

        for (const account of accounts) {
            await createMonthlyReport(account._id, startDate, endDate);
        };

    } catch (error) {
        throw new CustomError.ErrorGeneratingReport('An error occurred. Cannot generate the MONTHLY report.');
    }
});