"use strict";
const nodemailer = require("nodemailer");
require('dotenv').config();

// async..await is not allowed in global scope, must use a wrapper
async function main(message) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();
  
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MAIL_USER, // generated ethereal user
      pass: process.env.MAIL_PW // generated ethereal password
    },
  });
  
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Chico Wells" <chico.wells@icloud.com>', // sender address
    to: "macpence@mac.com", // list of receivers
    subject: "Error Message", // Subject line
    text: "A nuclear explosion happened today", // plain text body
    html: `<b>${message}</b>`, // html body
  });
  
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main("Millie wants some attention").catch(console.error);