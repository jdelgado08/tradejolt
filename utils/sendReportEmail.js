const sendEmail = require('./sendEmail');

// Send reports by mail
const sendReportEmail = async (userEmail, subject, reportHTML) => {
  await sendEmail({
    to: userEmail,
    subject: subject,
    html: reportHTML,
    text: `Please find the attached report.`,
  });
};

module.exports = sendReportEmail;