
const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
    
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    let info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text,
    });

    console.log(`Message sent: ${info.messageId}`);
};

module.exports = sendEmail;
