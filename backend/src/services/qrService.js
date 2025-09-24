const crypto = require("crypto");
const QRCodeModel = require("../models/QrCode.js");

module.exports.generateDynamicQR = async (className, subject) => {
  const token = crypto.randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + 10 * 1000); // valid for 10 sec

  const qrDoc = new QRCodeModel({ className, subject, token, expiresAt });
  await qrDoc.save();

  const payload = { className, subject, token };

  return payload;
};

module.exports.validateToken = async (token) => {
  const qr = await QRCodeModel.findOne({ token });
  if (!qr) {
    console.log("❌ Token not found or expired:", token);
    return null;
  }
  console.log("✅ Token valid:", qr.token, qr.className, qr.subject);
  return qr;
};