const { generateDynamicQR } = require("../services/qrService.js");

module.exports.getQR = async (req, res) => {
  try {
    const { className, subject } = req.query;
    const qrPayload = await generateDynamicQR(className, subject);
    res.json(qrPayload);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
