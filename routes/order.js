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
const { verifyToken, isAdmin } = require("../middleware/auth-middleware");

// GET all orders - ADMIN ONLY
router.get("/", verifyToken, isAdmin, async (req, res) => {
    //console.log("Getting ORDERS");
  try {
    const orders = await getOrders();
    res.json(orders);
  } catch (err) {
    console.error("Error getting orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET single order - ADMIN ONLY
router.get("/:id", verifyToken, isAdmin, async (req, res) => {
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

// UPDATE order - ADMIN ONLY
router.put("/:id", verifyToken, isAdmin, async (req, res) => {

  try {
    await updateOrder(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

// Send Email - ADMIN ONLY
router.post("/resend/:id", verifyToken, isAdmin, async (req, res) => {

  try {
    await sendShippingConfirmation(req.body);
    res.json({ success: true });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ error: "Failed to update order: "+err });
  }
});

// DELETE order - ADMIN ONLY
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await deleteOrder(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

module.exports = router;
