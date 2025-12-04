// utils/emailService.js
const { Resend } = require('resend');
const { getProducts } = require('../handlers/product-handler');
const Product = require('../db/product');
const Order = require('../db/order');
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOrderConfirmation({ to, name, confirmationNumber, productIds }) {

    const products = await Product.find({ _id: { $in: productIds } });

    const productHtml = products.map(p => `
  <a href="http://localhost:5173/archive/products/${p.id}" style="text-decoration:none; color:inherit; display:block; margin-bottom:10px;">
  <div>
    <img src="${p.images[0]}" alt="${p.name}" style="width:100px; height:133px; display:block;">
    <p style="font-size:12px; color:#888888; font-weight:300;">${p.name}</p>
  </div>
</a>
`).join('');

    console.log(`Sending order confirmation to ${to} for order #${confirmationNumber}...`);
  const subject = `Order Confirmation – #${confirmationNumber}`;
  const message = `
    <div style="font-family:sans-serif; line-height:1.5;">
      <h2>Thank you for your order, ${name || 'friend'}!</h2>
      <p>We’ve received your purchase and are getting it ready to ship. Processing may take 3-5 days.</p>
      <p><strong>Confirmation Number:</strong> ${confirmationNumber}</p>
      <p><strong>Items (${productIds.length}):</strong></p>
      ${productHtml}
      <p>You’ll receive another email when your order ships.</p>
      <p>If you have any questions or concerns regarding your order, please contact us at <a href="mailto:support@morningist.com">support@morningist.com</a>.</p>
      <p>💖 Thanks for shopping with us!</p>
      <br></br>
      <img src="/assets/logo.png" alt="Morningist" style="width:100px; height:auto; margin-top:20px; filter: invert(1);">
    </div>
  `;

  try {
  await resend.emails.send({
    from: 'Morningist <support@morningist.com>',
    to: to,
    subject: 'Order Confirmation - ' + confirmationNumber,
    html: message,
  });
  console.log("Email sent successfully?");
} catch (error) {
    console.error('Error sending order confirmation email:', error);
}
}

module.exports = { sendOrderConfirmation };
