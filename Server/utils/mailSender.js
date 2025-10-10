const nodemailer = require('nodemailer');
const mailSender = async(email, title, body) => {
    try{
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            auth    : {
                user : process.env.SMTP_USER,
                pass : process.env.SMTP_PASS
            }
        })
        const mailResponse = await transporter.sendMail({
            from : process.env.SMTP_USER,
            to : `${email}`,
                subject : `${title}`,
                text : `${body}`
        })
    }
    catch(err){
        console.log(err);
        throw new Error('Mail sending failed');
    }
}

module.exports = mailSender;
