const nodemailer = require("nodemailer");



const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'arnoldo.heaney8@ethereal.email',
        pass: '6j2f9Yqbn3jJkjvEpc'
    }
})

const mailer = message => {
    transporter.sendMail(message, (err, info) => {
        if (err) return console.log(err);
        console.log("email sent", info);
    })
}

module.exports = mailer