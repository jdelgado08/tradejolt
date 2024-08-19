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
        
        // // date Range
        // const startDate = moment().subtract(6, 'day').startOf('day').toISOString();
        // const endDate = moment().subtract(6, 'day').endOf('day').toISOString();

        // const startDate = moment('2024-08-12').startOf('day').toISOString(); // August 12th
        // const endDate = moment('2024-08-16').endOf('day').toISOString();     // August 16th

        const startDate = moment().subtract(0, 'month').startOf('month').toISOString();
        const endDate = moment().subtract(0, 'month').endOf('month').toISOString();


        //daily
        // await createDailyReport(accountId, startDate, endDate);
        // console.log('Daily report created successfully.');

        //weekly
        // await createWeeklyReport(accountId, startDate, endDate);
        // console.log('Weekly report created successfully.');

        //monthly
        await createMonthlyReport(accountId, startDate, endDate);
        console.log('Monthly report created successfully.');
        
    } catch (error) {
        console.error('Error generating report:', error);
    } finally {
        
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

testGenerateDailyReport();