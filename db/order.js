const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    confirmationNumber: String,
    productIds: [String],
    datePurchased: Date,
    purchaserName: String,
    purchaserEmail: String,
    dateShipped: Date,
    addressLine1: String,
    addressLine2: String,
    addressCity: String,
    addressState: String,
    addressPostalCode: String,
    trackingNumber: String,
    trackingProvider: String,
    trackingUrl: String,
    dateDelivered: Date,
    isHandDelivered: Boolean
});
const Order = mongoose.model('orders', orderSchema);
module.exports = Order;