require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const moment = require('moment');
const { createDailyReport } = require('../utils/createReport'); 
const Account = require('../models/Account');
const mongoDB = require('../db/connect')
const express = require('express')
const app = express()

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
    
    start()

   
        // Hardcode values test propose only
        const accountId = '6696ac13f97b3a99e76b7c72';
        const startDate = moment().subtract(1, 'day').startOf('day').toISOString();
        const endDate = moment().subtract(1, 'day').endOf('day').toISOString();

     
        await createDailyReport(accountId, startDate, endDate);

        console.log('Daily report generation test completed successfully.');
   
};

testGenerateDailyReport();