const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.NODE_ENV === 'development' ? process.env.DEV_EMAIL_HOST : process.env.PROD_EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.NODE_ENV === 'development' ? process.env.DEV_EMAIL_USER : process.env.PROD_EMAIL_USER,
            pass: process.env.NODE_ENV === 'development' ? process.env.DEV_EMAIL_PASSWORD : process.env.PROD_EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;