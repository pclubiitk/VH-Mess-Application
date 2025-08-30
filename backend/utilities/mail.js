const nodemailer = require("nodemailer");

const user = process.env.MAIL_USER;
const pass = process.env.MAIL_PASS;
const host = process.env.MAIL_HOST;
const port = process.env.MAIL_PORT;
const sender = `${user}`;

async function sendmail(to, subject, body) {
    try {
        const transporter = nodemailer.createTransport({
            host,
            port,
            secure: true,
            auth: {
                user,
                pass
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: `VH Mess IITK <${sender}>`,
            to: to  ,
            subject,
            html: body.replace(/\n/g, "<br>")
        };
        console.log("Sending mail to:", to);
        console.log("Mail options:", mailOptions);
        let info = await transporter.sendMail(mailOptions);
        console.log("Mail sent:", info.messageId);
    } catch (err) {
        console.error("Error sending mail:", err);
    }
}

module.exports = {
    sendmail
}