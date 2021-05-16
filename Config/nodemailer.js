const
    nodemailer = require('nodemailer'),
    config = require('../Config/config.json');

const transporter = nodemailer.createTransport({
    service: config.email.service,
    auth: {
        user: config.email.auth.user,
        pass: config.email.auth.password
    },
    secure: true
});

async function sendMail(from, to, subject, text, html) {
    return new Promise((resolve, reject) => {
        transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            text: text,
            html: html
        }, (error, info) => {
            if (error) {
                console.log("Email send error " + error);
                reject(error);
            } else {
                console.log('Email sent: ' + info.response);
                resolve(true);
            }
        })
    })
}

module.exports = sendMail;