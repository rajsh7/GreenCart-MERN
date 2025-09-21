const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  current_shift_hours: { type: Number, default: 0 },
  past_7_days: { type: [Number], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Driver', DriverSchema);
