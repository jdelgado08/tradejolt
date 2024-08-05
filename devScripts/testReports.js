require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const moment = require('moment');
const { 
    createDailyReport,
    createWeeklyReport,
    createMonthlyReport,

} = require('../utils/createReport'); 

const Account = require('../models/Account');
const mongoDB = require('../db/connect')
const express = require('express');
const app = express();

const testGenerateDailyReport = async () => {
    // Connect to MongoDB
    const port = process.env.PORT || 3000
    const start = async () => {
        try {
            await mongoDB()
            app.listen(port, console.log(`Server is listening at port ${port}!!!`))
        } catch (error) {
            console.log(error);
        }
    }
    
    start();

   
        // Hardcode values test propose only
        const accountId = '66b125448da2231dd30c934e';
        //daily
        const startDate = moment().subtract(1, 'day').startOf('day').toISOString();
        const endDate = moment().subtract(1, 'day').endOf('day').toISOString();
        //weekly
        // const startDate = moment().subtract(1, 'week').startOf('week').toISOString();
        // const endDate = moment().subtract(1, 'week').endOf('week').toISOString();
        //monthy
        // const startDate = moment().subtract(1, 'month').startOf('month').toISOString();
        // const endDate = moment().subtract(1, 'month').endOf('month').toISOString();
            
        await createDailyReport(accountId, startDate, endDate);
        // await createWeeklyReport(accountId, startDate, endDate);
        // await createMonthlyReport(accountId, startDate, endDate);

        console.log('Daily report created successfully.');
        // console.log('Weeklt report created successfully.');
        // console.log('monthly report created successfully.');
   
};

testGenerateDailyReport();