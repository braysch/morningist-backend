const express = require("express");
const { Resend } = require("resend");

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

router.post("", async (req, res) => {
  const { name, email, orderNumber, message } = req.body;

  console.log(`Received contact message from ${name} (${email})`);

  try {
    await resend.emails.send({
      from: "Support <support@morningist.com>",
      to: "support@morningist.com",
      subject: `New Contact Message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Order Number:</strong> ${orderNumber || "None"}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email send failed:", err);
    return res.status(500).json({ success: false });
  }
});

module.exports = router;
