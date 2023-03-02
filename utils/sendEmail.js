const nodemailer = require("nodemailer")

const sendEmail = async (options) => {
  let testAccount = await nodemailer.createTestAccount()
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  })
  const message = {
    from: "testADI.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  }

  await transporter.sendMail(message)
}

module.exports = sendEmail
