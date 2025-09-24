const { validateToken } = require("../services/qrService");
const {
  hasAlreadyMarked,
  saveAttendance,
} = require("../services/attendanceService");

module.exports.markAttendance = async (req, res) => {
  try {
    const { studentId, token } = req.body;

    // 🔎 Debug log
    console.log("📥 Received from frontend:", { studentId, token });

    const qr = await validateToken(token);

    // 🔎 Debug log
    console.log("🔑 Token validation result:", qr);

    if (!qr) {
      return res.status(400).json({ message: "Invalid or expired QR" });
    }

    const alreadyMarked = await hasAlreadyMarked(
      studentId,
      qr.className,
      qr.subject
    );

    console.log("📌 Already marked check:", alreadyMarked);

    if (alreadyMarked) {
      return res.status(400).json({ message: "Attendance already marked" });
    }

    const attendance = await saveAttendance(
      studentId,
      qr.className,
      qr.subject
    );

    console.log("✅ Attendance saved:", attendance);

    res.json({ message: "Attendance marked successfully", attendance });
  } catch (err) {
    console.error("❌ Error marking attendance:", err);
    res.status(500).json({ error: err.message });
  }
};
