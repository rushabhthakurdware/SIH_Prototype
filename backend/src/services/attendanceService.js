const Attendance = require("../models/Attendance");
const hasAlreadyMarked = async (studentId, className, subject) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  return await Attendance.findOne({
    studentId,
    className,
    subject,
    date: { $gte: todayStart, $lt: todayEnd },
  });
};
const saveAttendance = async (studentId, className, subject) => {
  const attendance = new Attendance({
    studentId,
    className,
    subject,
  });
  return await attendance.save();
};

module.exports = { hasAlreadyMarked, saveAttendance };
