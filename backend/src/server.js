const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");
const deviceRoutes = require("./routes/deviceRoutes.js");
const qrRoutes = require("./routes/qrRoutes.js");
const attendanceRoutes = require("./routes/attendanceRoutes.js");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Routes
app.use("/api/device", deviceRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/attendance", attendanceRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () =>
    console.log(`🚀 Server running on http://192.168.2.6:${PORT}`)
  );
});

