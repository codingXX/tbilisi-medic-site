require("dotenv").config();


const express = require("express");
const path = require("path");
const { port } = require("./config");
const { sendRequestEmail } = require("./mailer");

const app = express();
app.use(express.json({ limit: "100kb" }));

// Static frontend serving (project root)
const rootDir = path.join(__dirname, "..");
app.use(express.static(rootDir));

// Simple validation
function isNonEmptyString(v, min = 2) {
  return typeof v === "string" && v.trim().length >= min;
}

function normalizePhone(phoneRaw) {
  const phone = String(phoneRaw || "").trim();
  // allow +995 and digits/spaces
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned;
}

function isValidPhone(phone) {
  // minimum 9 digits overall
  const digits = phone.replace(/[^\d]/g, "");
  return digits.length >= 9 && digits.length <= 15;
}

// API endpoint
app.post("/api/request-call", async (req, res) => {
  try {
    const { firstName, lastName, phone, category } = req.body || {};

    if (!isNonEmptyString(firstName, 2)) {
      return res.status(400).json({ ok: false, message: "სახელი სავალდებულოა (მინ. 2 სიმბოლო)" });
    }
    if (!isNonEmptyString(lastName, 2)) {
      return res.status(400).json({ ok: false, message: "გვარი სავალდებულოა (მინ. 2 სიმბოლო)" });
    }

    const phoneNorm = normalizePhone(phone);
    if (!isValidPhone(phoneNorm)) {
      return res.status(400).json({ ok: false, message: "ტელეფონი არასწორია (მინ. 9 ციფრი)" });
    }

    const allowed = new Set(["tech", "furniture", "consumables", "lab"]);
    if (!allowed.has(category)) {
      return res.status(400).json({ ok: false, message: "კატეგორია არასწორია" });
    }

    await sendRequestEmail({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phoneNorm,
      category
    });

    return res.json({ ok: true, message: "მოთხოვნა გაგზავნილია" });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ ok: false, message: "სერვერის შეცდომა. სცადე მოგვიანებით." });
  }
});

// Optional: direct routes (if you open /request-call)
app.get("/request-call", (_, res) => res.sendFile(path.join(rootDir, "request-call.html")));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
