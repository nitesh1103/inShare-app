const nodemailer = require('nodemailer');

async function sendEmail({ from, to, subject, text, html }) {
  // nodemailer configuration.
  // SMTP - Simple Mail Transfer Protocol. (sendinblue).
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  // Send-Mail.
  const info = await transport.sendMail({
    from: `inShare <${from}>`,
    to: to,
    subject: subject,
    text: text,
    html: html
  });
  // console.log(info);
};

module.exports = sendEmail;
