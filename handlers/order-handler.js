const Order = require("../db/order");

// CREATE
async function addOrder(model) {
    let order = new Order({
        confirmationNumber: model.confirmationNumber,
        purchaserName: model.purchaserName,
        productIds: model.productIds,
        addressLine1: model.addressLine1,
        addressLine2: model.addressLine2,
        addressCity: model.addressCity,
        addressState: model.addressState,
        dateShipped: model.dateShipped,
        dateDelivered: model.dateDelivered,
    });

    await order.save();
    return order.toObject();
}

// UPDATE
async function updateOrder(id, model) {
    await Order.findOneAndUpdate({ _id: id }, model);
    return;
}

// READ ALL
async function getOrders() {
    let orders = await Order.find();
    return orders.map(order => order.toObject());
}

// READ ONE
async function getOrderById(id) {
    let order = await Order.findById(id);
    return order?.toObject();
}

// DELETE
async function deleteOrder(id) {
    await Order.deleteOne({ _id: id });
    return;
}

module.exports = {
    addOrder,
    updateOrder,
    getOrders,
    getOrderById,
    deleteOrder,
};
