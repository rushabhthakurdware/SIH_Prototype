const qrService = require("../services/qrService");

exports.startAttendance = async (req, res) => {
  const { classId } = req.body;
  if (!classId) return res.status(400).send("classId is required");
  await qrService.startQRGeneration(classId);
  res.send("QR generation started for 10 minutes.");
};

exports.getCurrentQR = (req, res) => {
  const qr = qrService.getCurrentQR();
  if (!qr) return res.status(404).send("No QR generated yet.");
  res.json({ qrImage: qr });
};

exports.submitQR = async (req, res) => {
  const { qrData } = req.body;
  const studentId = req.user._id; // from authMiddleware
  if (!qrData) return res.status(400).send("qrData is required");

  const result = await qrService.validateQR(qrData, studentId);
  if (!result.valid) return res.status(400).send(result.message);

  res.send("Attendance marked successfully!");
};
