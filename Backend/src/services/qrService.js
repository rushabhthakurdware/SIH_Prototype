const QRCode = require("qrcode");
const Attendance = require("../models/Attendance");
const { v4: uuidv4 } = require("uuid");

let currentQR = null;  // to store the latest QR
let interval = null;

exports.startQRGeneration = async (classId) => {
  let count = 0;
  interval = setInterval(async () => {
    if (count >= 60) { // 10min / 10s = 60
      clearInterval(interval);
      return;
    }

    const qrData = `attendance-${classId}-${uuidv4()}`;
    const qrImage = await QRCode.toDataURL(qrData);

    const expiresAt = new Date(Date.now() + 10000); // expires in 10s

    await Attendance.create({ classId, qrData, expiresAt });

    currentQR = qrImage;  // save latest QR
    console.log(`Generated QR #${count + 1}`);
    count++;
  }, 10000);
};

// Function to get the latest QR
exports.getCurrentQR = () => {
  return currentQR;
};

// Function to validate QR submission
exports.validateQR = async (qrData, studentId) => {
  const qrRecord = await Attendance.findOne({ qrData });
  if (!qrRecord) return { valid: false, message: "Invalid QR" };
  if (qrRecord.expiresAt < new Date()) return { valid: false, message: "QR expired" };
  if (qrRecord.scannedBy.includes(studentId)) return { valid: false, message: "Already scanned" };

  qrRecord.scannedBy.push(studentId);
  await qrRecord.save();

  return { valid: true };
};
