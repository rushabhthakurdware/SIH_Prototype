const { validateToken } = require("../services/qrService");
const {
  hasAlreadyMarked,
  saveAttendance,
} = require("../services/attendanceService");

module.exports.markAttendance = async (req, res) => {
  try {
    const { studentId, token } = req.body;
    if (!studentId || !token) {
      return res.status(400).json({ message: "Student ID and token required" });
    }

    const qr = await validateToken(token);
    if (!qr) {
      return res.status(400).json({ message: "Invalid or expired QR" });
    }

    const alreadyMarked = await hasAlreadyMarked(
      studentId,
      qr.className,
      qr.subject
    );
    if (alreadyMarked) {
      return res.status(400).json({ message: "Attendance already marked" });
    }

    // Save attendance
    const attendance = await saveAttendance(
      studentId,
      qr.className,
      qr.subject
    );

    res.json({ message: "Attendance marked successfully", attendance });
  } catch (err) {
    console.error("Error marking attendance:", err);
    res.status(500).json({ error: err.message });
  }
};
