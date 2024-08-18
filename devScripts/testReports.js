require('dotenv').config();
const mongoose = require('mongoose');
const moment = require('moment');
const { 
    createDailyReport,
    createWeeklyReport,
    createMonthlyReport,
} = require('../utils/createReport'); 


const mongoDB = require('../db/connect');

const testGenerateDailyReport = async () => {
    try {
    

        await mongoDB();
    

        const accountId = '66b125448da2231dd30c934e'; // Example accountId, change as needed
        
        // date Range
        const startDate = moment().subtract(2, 'day').startOf('day').toISOString();
        const endDate = moment().subtract(2, 'day').endOf('day').toISOString();

        //daily
        await createDailyReport(accountId, startDate, endDate);
        console.log('Daily report created successfully.');

        //weekly
        // await createWeeklyReport(accountId, startDate, endDate);
        // console.log('Weekly report created successfully.');

        //monthly
        // await createMonthlyReport(accountId, startDate, endDate);
        // console.log('Monthly report created successfully.');
        
    } catch (error) {
        console.error('Error generating report:', error);
    } finally {
        
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

testGenerateDailyReport();