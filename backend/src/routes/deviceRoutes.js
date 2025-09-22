const express = require("express");
const { scanDevice } = require("../controllers/deviceController.js");

const router = express.Router();

router.post("/scan", scanDevice);

module.exports = router;
