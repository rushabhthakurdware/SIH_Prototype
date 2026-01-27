const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
const path = require("path");
app.use(express.static(path.join(__dirname, "../public")));


app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
const qrRoutes = require("./routes/qr");
app.use("/api/qr", qrRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
