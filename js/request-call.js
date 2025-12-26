const form = document.getElementById("requestForm");
const msg = document.getElementById("formMsg");

function setMsg(text, type = "info") {
  msg.className = `form-msg ${type}`;
  msg.textContent = text;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setMsg("");

  const payload = {
    firstName: document.getElementById("firstName").value.trim(),
    lastName: document.getElementById("lastName").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    category: document.getElementById("category").value
  };

  try {
    setMsg("იგზავნება...", "info");

    const res = await fetch("/api/request-call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setMsg(data.message || "შეცდომა. გადაამოწმე ველები.", "error");
      return;
    }

    setMsg(data.message || "მოთხოვნა გაგზავნილია", "success");
    form.reset();
  } catch (err) {
    console.error(err);
    setMsg("სერვერთან დაკავშირება ვერ მოხერხდა.", "error");
  }
});
