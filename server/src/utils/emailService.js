const nodemailer = require("nodemailer");

const getTransporter = () => {
  const smtpPort = Number(process.env.SMTP_PORT) || 587;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        : undefined
  });
};

const sendEmail = async ({ to, subject, text }) => {
  const transporter = getTransporter();

  return transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text
  });
};

const sendRegistrationEmail = async (to) => {
  return sendEmail({
    to,
    subject: "Welcome to Interns.Net",
    text: `Hello,

Your account has been successfully created on Interns.Net.

You can now login and use the Internship Management System.

Thank you for joining us.`
  });
};

const sendApplicationAcceptedEmail = async ({ to, studentName, companyName, internshipTitle }) => {
  return sendEmail({
    to,
    subject: "Internship Application Accepted",
    text: `Congratulations ${studentName}!

Your application for ${internshipTitle} at ${companyName} has been accepted.

Please login to your account for further details.

Best wishes for your internship journey.`
  });
};

module.exports = {
  sendRegistrationEmail,
  sendApplicationAcceptedEmail
};
