const express = require("express");
const router = express.Router();

const {
  addOrder,
  updateOrder,
  getOrders,
  getOrderById,
  deleteOrder,
} = require("../handlers/order-handler");
const { sendShippingConfirmation } = require("../util/resend");

// GET all orders
router.get("/", async (req, res) => {
    //console.log("Getting ORDERS");
  try {
    const orders = await getOrders();
    res.json(orders);
  } catch (err) {
    console.error("Error getting orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET single order
router.get("/:id", async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error("Error getting order:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// CREATE order
router.post("/", async (req, res) => {
  try {
    const created = await addOrder(req.body);
    res.json(created);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// UPDATE order
router.put("/:id", async (req, res) => {

  try {
    await updateOrder(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

// Send Email
router.post("/resend/:id", async (req, res) => {

  try {
    await sendShippingConfirmation(req.body);
    res.json({ success: true });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ error: "Failed to update order: "+err });
  }
});

// DELETE order
router.delete("/:id", async (req, res) => {
  try {
    await deleteOrder(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

module.exports = router;
