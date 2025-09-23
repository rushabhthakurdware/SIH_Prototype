const express = require("express");
const { getQR } = require("../controllers/qrController.js");

const router = express.Router();
router.get("/generate", getQR);

module.exports = router;
