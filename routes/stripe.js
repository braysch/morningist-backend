const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../db/order');

router.post('/create-checkout-session', express.json(), async (req, res) => {
  const { products } = req.body;

  const lineItems = products.map(product => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: product.name,
        images: product.images,
      },
      unit_amount: Math.round(product.price * 100),
    },
    quantity: 1,
  }));

  // Configure shipping options for multiple countries
  // https://docs.stripe.com/payments/checkout/custom-shipping-options

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    shipping_address_collection:
    { allowed_countries: ['US'] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 0, currency: 'usd' },
          display_name: 'US Standard Shipping',
          delivery_estimate: { minimum: { unit: 'business_day', value: 3 }, maximum: { unit: 'business_day', value: 5 } },
        },
      },
    ],
    success_url: `${process.env.FRONTEND_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/basket`,
    metadata: { productIds: products.map(p => p._id).join(',') },
  });

  res.json({ url: session.url });
});

router.get("/checkout-session", async (req, res) => {
  console.log("Retrieving checkout session...");
  const { sessionId } = req.query;
  if (!sessionId) return res.status(400).send("No session ID");

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  res.json(session);
});

module.exports = router;
