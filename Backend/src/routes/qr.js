const express = require("express");
const QRCode = require("qrcode");
const router = express.Router();

// Public test QR endpoint
router.get("/test-qr", async (req, res) => {
  try {
    const url = "https://example.com"; // You can change this
    const qr = await QRCode.toDataURL(url);
    res.json({ qr });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
