const path = require('path');
const ejs = require('ejs');
const NotFoundError = require('../errors/not-found'); 

//Dinamique HTML -> EJS
const generateReportHTML = async (accountName, reportType, summaryData, trades) => {
  
    const templatePath = path.join(__dirname, '../views/reportTemplate.ejs'); //view EJS template
    // console.log('Template Path:', templatePath); //debug
  
  try {
    const reportHTML = await ejs.renderFile(templatePath, {
      accountName,
      reportType,
      summaryData,
      trades: Array.isArray(trades) ? trades : [], //ensure ist as an array even if is empty
      formatDate: (date) => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
      }
    });
    
    return reportHTML;
  } catch (err) {
    console.error('EJS Rendering Error:', err); // Log the error
    throw new NotFoundError('Template file not found or rendering failed');
  }
};

module.exports = generateReportHTML;