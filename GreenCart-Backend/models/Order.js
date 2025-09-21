// models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    order_id: { type: String, required: true, unique: true },
    route_id: { type: String, required: true }, // reference to Route
    revenue: { type: Number, required: true },
    cost: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
