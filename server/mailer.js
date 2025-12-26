const nodemailer = require("nodemailer");
const config = require("./config");

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

function categoryToEmail(category) {
  return config.emails[category] || config.emails.tech;
}

async function sendRequestEmail({ firstName, lastName, phone, category }) {
  const toEmail = categoryToEmail(category);

  return transporter.sendMail({
    from: config.smtp.fromEmail,
    to: toEmail,
    subject: "📞 ახალი ზარის მოთხოვნა",
    text: `
სახელი: ${firstName}
გვარი: ${lastName}
ტელეფონი: ${phone}
კატეგორია: ${category}
    `,
  });
}

module.exports = {
  sendRequestEmail,
};
