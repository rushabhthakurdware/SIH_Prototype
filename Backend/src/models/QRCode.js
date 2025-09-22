const mongoose = require('mongoose');

const qrSchema = new mongoose.Schema({
  qrData: { type: String, required: true, unique: true },
  classId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  isValid: { type: Boolean, default: true },
});

module.exports = mongoose.model('QRCode', qrSchema);
