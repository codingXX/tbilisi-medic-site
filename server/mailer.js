const config = require("./config");

function categoryToEmail(category) {
  return config.emails[category] || config.emails.tech;
}

async function sendRequestEmail({ firstName, lastName, phone, category }) {
  const toEmail = categoryToEmail(category);

  const subject = "📞 ახალი ზარის მოთხოვნა";
  const text = `სახელი: ${firstName}
გვარი: ${lastName}
ტელეფონი: ${phone}
კატეგორია: ${category}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.smtp.fromEmail,     // FROM_EMAIL env-დან
      to: [toEmail],
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend error: ${res.status} ${body}`);
  }

  return res.json();
}

module.exports = { sendRequestEmail };
