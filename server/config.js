function must(name) {
  const v = process.env[name];
  if (!v) throw new Error(`❌ Missing env var: ${name}`);
  return v;
}

module.exports = {
  port: Number(process.env.PORT || 3000),

  // SMTP აღარ გვჭირდება API გზაზე, მაგრამ FROM_EMAIL მაინც გვჭირდება:
  smtp: {
    fromEmail: must("FROM_EMAIL"),
  },

  emails: {
    tech: must("EMAIL_TECH"),
    furniture: must("EMAIL_FURNITURE"),
    consumables: must("EMAIL_CONSUMABLES"),
    lab: must("EMAIL_LAB"),
  },
};
