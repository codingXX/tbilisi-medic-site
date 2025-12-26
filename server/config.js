
function must(name) {
  const v = process.env[name];
  if (!v) {
    throw new Error(`❌ Missing env var: ${name}`);
  }
  return v;
}

module.exports = {
  port: Number(process.env.PORT || 3000),

  smtp: {
    host: must("SMTP_HOST"),
    port: Number(must("SMTP_PORT")),
    user: must("SMTP_USER"),
    pass: must("SMTP_PASS"),
    fromEmail: process.env.FROM_EMAIL || must("SMTP_USER"),
  },

  emails: {
    tech: must("EMAIL_TECH"),
    furniture: must("EMAIL_FURNITURE"),
    consumables: must("EMAIL_CONSUMABLES"),
    lab: must("EMAIL_LAB"),
  },
};


