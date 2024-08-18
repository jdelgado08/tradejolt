const sendEmail = require('./sendEmail');
const generateReportHTML = require('./generateReportHTML');

//send reports by mail
const sendReportEmail = async (userEmail, accountName, reportType, summaryData, trades) => {
  //dinamique HtML
  const reportHTML = await generateReportHTML(accountName, reportType, summaryData, trades);

  await sendEmail({
    to: userEmail,
    subject: `${reportType} Trade Report for Account: ${accountName}`,
    html: reportHTML,
    text: `Please find the attached ${reportType.toLowerCase()} trade report for your account: ${accountName}.`,

  });
};

module.exports = sendReportEmail;