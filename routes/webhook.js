const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const Order = require('../db/order');
const Product = require('../db/product');
const { sendOrderConfirmation } = require('../util/resend');

router.post("",
  express.raw({ type: 'application/json' }), // ⚠️ raw body required
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      console.log('Processing webhook event...');
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('⚠️ Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('🎯 Webhook received:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      console.log('Session Object:');
      console.log(session);

    const orderCount = await Order.countDocuments();
    const confirmationNumber = String(orderCount + 1).padStart(4, '0');

      const productIds = session.metadata?.productIds
        ? session.metadata.productIds.split(',')
        : [];

      const newOrder = new Order({
        confirmationNumber: confirmationNumber,
        productIds: productIds,
        datePurchased: new Date(),
        purchaserName: session.customer_details?.name,
        purchaserEmail: session.customer_details?.email,
        addressLine1: session.customer_details?.address?.line1,
        addressLine2: session.customer_details?.address?.line2,
        addressCity: session.customer_details?.address?.city,
        addressState: session.customer_details?.address?.state,
        addressPostalCode: session.customer_details?.address?.postal_code,
        dateShipped: null,
        trackingNumber: null,
        trackingProvider: null,
        trackingUrl: null,
        dateDelivered: null,
        isHandDelivered: false
      });

      await newOrder.save();
      console.log('✅ Order saved to database:', newOrder);

      if (session.metadata.productIds) {
        for (const productId of productIds) {
          await Product.findByIdAndUpdate(productId,
            { isSold: true }
          );
        }
      }

       await sendOrderConfirmation(newOrder);
    }

    res.status(200).send('ok');
  }
);

module.exports = router;
