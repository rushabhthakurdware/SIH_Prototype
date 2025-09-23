const mongoose = require("mongoose");

const qrSchema = new mongoose.Schema({
  className: String,
  subject: String,
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});

qrSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("QRCode", qrSchema);
