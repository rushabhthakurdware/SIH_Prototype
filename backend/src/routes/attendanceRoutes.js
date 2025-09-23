const express = require("express");
const { markAttendance } = require("../controllers/attendanceController.js");

const router = express.Router();
router.post("/mark", markAttendance);

module.exports = router;
