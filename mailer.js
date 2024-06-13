
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.emailFrom,
    pass: process.env.emailToken,
  },
});




module.exports = transporter;