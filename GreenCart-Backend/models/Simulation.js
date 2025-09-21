// models/Simulation.js
const mongoose = require("mongoose");

const SimulationSchema = new mongoose.Schema(
  {
    input_params: {
      num_drivers: { type: Number, required: true },
      route_start_time: { type: String, required: true },
      max_hours_per_driver: { type: Number, required: true },
    },
    result: {
      total_revenue: { type: Number, default: 0 },
      total_cost: { type: Number, default: 0 },
      total_profit: { type: Number, default: 0 },
      efficiency: { type: Number, default: 0 },
      on_time: { type: Number, default: 0 },
      total_deliveries: { type: Number, default: 0 },
      details: [
        {
          order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
          driver: { type: String },
          route: { type: String },
          start: { type: String },
          end: { type: String },
          revenue: { type: Number },
          cost: { type: Number },
          profit: { type: Number },
          onTime: { type: Boolean },
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Simulation", SimulationSchema);
