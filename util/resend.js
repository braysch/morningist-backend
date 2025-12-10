// utils/emailService.js
const { Resend } = require('resend');
const { getProducts } = require('../handlers/product-handler');
const Product = require('../db/product');
const Order = require('../db/order');
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOrderConfirmation(order) {

    const products = await Product.find({ _id: { $in: order.productIds } });
    const to = order.purchaserEmail;
    const productHtml = products.map(p => `
  <a href="${process.env.FRONTEND_URL}/archive/products/${p.id}" style="text-decoration:none; color:inherit; display:block; margin-bottom:10px;">
  <div>
    <img src="${p.images[0]}" alt="${p.name}" style="width:100px; height:133px; display:block;">
    <p style="font-size:12px; color:#888888; font-weight:300;">${p.name}</p>
  </div>
</a>
`).join('');

    console.log(`Sending order confirmation to ${to} for order #${order.confirmationNumber}...`);
  const subject = `Order Confirmation – #${order.confirmationNumber}`;
  const message = `
    <div style="font-family:sans-serif; line-height:1.5;">
      <h2>Thank you for your order, ${order.purchaserName.split(" ")[0] || 'friend'}!</h2>
      <p>We’ve received your purchase and are getting it ready to ship. Processing may take 3-5 days.</p>
      <p><strong>Confirmation Number:</strong> ${order.confirmationNumber}</p>
      <p><strong>Items (${order.productIds.length}):</strong></p>
      ${productHtml}
      <p>Sending to:</p>
      <div style="line-height:1.1;">
      <p>${order.addressLine1}</p>
      <p>${order.addressLine2}</p>
      <p>${order.addressCity}, ${order.addressState} ${order.addressPostalCode}</p>
      </div>
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
    subject: subject,
    html: message,
  });
  console.log("Email sent successfully?");
} catch (error) {
    console.error('Error sending order confirmation email:', error);
}
}

async function sendShippingConfirmation(order) {

  console.log(order);

  const products = await Product.find({ _id: { $in: order.productIds } });

    const productHtml = `
<div style="display: flex; flex-direction: row; gap: 10px; flex-wrap: wrap;">
  ${products.map(p => `
    <a href="${process.env.FRONTEND_URL}/archive/products/${p.id}" style="text-decoration:none; color:inherit;">
      <div style="display: flex; flex-direction: column; align-items: center;">
        <img src="${p.images[0]}" alt="${p.name}" style="width:100px; height:133px; display:block;">
      </div>
    </a>
  `).join('')}
</div>
`;


  const subject = `Your Order (#${order.confirmationNumber}) Has Shipped`;
  const to = order.purchaserEmail;
  const shippingSection = order.isHandDelivered
  ? `
      <p><strong>Your order was hand-delivered to your address.</strong></p>
    `
  : `
      <p><strong>Shipping Provider:</strong> ${order.trackingProvider}</p>
      <p><strong>Tracking number:</strong> <a href="${order.trackingUrl}">${order.trackingNumber}</a></p>
      <p>Your order should be delivered within 3-5 business days.</p>
    `;

  const message = `
    <div style="font-family:sans-serif; line-height:1.5;">
      <h2>Hi, ${(order.purchaserName).split(" ")[0] || 'friend'}!</h2>
      <p>We've processed your order and it has been shipped to your address.</p>
      <p><strong>Confirmation Number:</strong> ${order.confirmationNumber}</p>
      <p><strong>Items (${order.productIds.length}):</strong></p>
      ${productHtml}
      <p><strong>Shipping to:</strong></p>
      <div style="line-height:1.1;">
      <p>${order.addressLine1}</p>
      <p>${order.addressLine2}</p>
      <p>${order.addressCity}, ${order.addressState} ${order.addressPostalCode}</p>
      </div>
      ${shippingSection}
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
    subject: subject,
    html: message,
  });
  console.log("Email sent successfully?");
} catch (error) {
    console.error('Error sending order confirmation email:', error);
}

}

module.exports = { sendOrderConfirmation, sendShippingConfirmation };
