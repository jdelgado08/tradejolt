const path = require('path');
const ejs = require('ejs');
const NotFoundError = require('../errors/not-found'); 

//Dinamique HTML -> EJS
const generateReportHTML = async (accountName, reportType, summaryData, trades = [], dailyReports = [], weeklyReports = []) => {
  
  let templatePath;

  switch (reportType) {
    case 'daily':
      templatePath = path.join(__dirname, '../views/dailyReportTemplate.ejs');
      break;
    case 'custom':
      templatePath = path.join(__dirname, '../views/customReportTemplate.ejs');
      break;
    case 'weekly':
      templatePath = path.join(__dirname, '../views/weeklyReportTemplate.ejs');
      break;
    case 'monthly':
      templatePath = path.join(__dirname, '../views/monthlyReportTemplate.ejs');
      break;
    default:
      throw new NotFoundError('Invalid report type');
  }

  try {
    const reportHTML = await ejs.renderFile(templatePath, {
      accountName,
      reportType,
      summaryData,
      trades: Array.isArray(trades) ? trades : [],
      dailyReports: Array.isArray(dailyReports) ? dailyReports : [],
      weeklyReports: Array.isArray(weeklyReports) ? weeklyReports : [],
      formatDate: (date) => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
      }
    });
    
    return reportHTML;
  } catch (err) {
    console.error('EJS Rendering Error:', err);
    throw new NotFoundError('Template file not found or rendering failed');
  }
};

module.exports = generateReportHTML;
