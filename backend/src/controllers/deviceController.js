const { saveDevice } = require("../services/DeviceService");

module.exports.scanDevice = async (req, res) => {
  try {
    const { deviceId } = req.body;
    if (!deviceId)
      return res.status(400).json({ message: "Device ID required" });

    const device = await saveDevice(deviceId);
    return res.status(200).json({ success: true, device });
  } catch (err) {
    console.error("Error scanning device:", err);
    res.status(500).json({ message: "Server error" });
  }
};
