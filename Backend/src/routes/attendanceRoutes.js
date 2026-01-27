const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/start-attendance', authMiddleware, attendanceController.startAttendance);
router.get('/current-qr', authMiddleware, attendanceController.getCurrentQR);
router.post('/submit-qr', authMiddleware, attendanceController.submitQR);

module.exports = router;
