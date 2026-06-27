const { buildWelcomeHtml } = require("../templates/welcomeTemplate");
const BREVO_API_URL = process.env.BREVO_API_URL || "https://api.brevo.com/v3/smtp/email";

// Subject ma name lagadvu ho to normal rakhvu puncutations vagar
const sendWelcomeEmail = async (toEmail, username) => {
  const subjectText = `Access your Eternix account, ${username}`;

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Eternix", email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email: toEmail, name: username }],
      subject: subjectText,
      htmlContent: buildWelcomeHtml(username),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
};

module.exports = { sendWelcomeEmail };