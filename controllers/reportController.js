const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
    checkPermissions,
  
} = require('../utils');

//get reports by accountID and Period
//get all the reports from a certain account

const getReports = (req, res) => {
    //get req.query (period , accountId)
    // and do a .find (witht he query provide)

    //limite reports to:
    //  - Admin ALL
    //  - Manager only managed Users
    //  - Users only their own reports 
    res.send('get Report');
}


module.exports = {
    getReports,

}