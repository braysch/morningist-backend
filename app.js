const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const cors = require("cors");

require("dotenv").config();

const categoryRouter = require("./routes/category");
const subcategoryRouter = require("./routes/subcategory");
const productRouter = require("./routes/product");
const customerRouter = require("./routes/customer");
const authRouter = require("./routes/auth");
const stripeRouter = require("./routes/stripe");
const webhookRouter = require("./routes/webhook");
const contactRouter = require("./routes/contact");
const { verifyToken, isAdmin } = require("./middleware/auth-middleware");

app.use(cors());
app.use("/api/stripe/webhook", webhookRouter);
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: "GET,POST",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Server running");
});

app.use("/category", categoryRouter); // , verifyToken, isAdmin,
app.use("/subcategory", subcategoryRouter); // , verifyToken, isAdmin,
app.use("/product", productRouter); // , verifyToken, isAdmin,
app.use("/customer", customerRouter); // , verifyToken,
app.use("/auth", authRouter);
app.use("/api/stripe", stripeRouter);
app.use("/contact", contactRouter);

async function connectDB() {
  mongoose.connect(process.env.MONGODB_URI, {
    dbName: "morningist-store-db",
  });
  console.log("Connected to MongoDB", mongoose.connection.host);
}
connectDB().catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

app.listen(port, () => {
  console.log("Server running on port", port);
});
