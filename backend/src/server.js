require("dotenv").config()

const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")

const connectDB = require("./config/mongoConfig")
const authRoutes = require("./routes/authRoutes")
const caseRoutes = require("./routes/caseRoutes")
const personRoutes = require("./routes/personRoutes")
const policeStationRoutes = require("./routes/policeStationRoutes")
const formRoutes = require("./routes/formRoutes")
const adminRoutes = require("./routes/adminRoutes")

const app = express()

// MIDDLEWARE ORDER (IMPORTANT)
// Don't use express.json() globally - it will interfere with multipart
// multer needs to handle multipart data, then express.json() for json
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser())  
app.use(cors({
  origin: true,
  credentials: true
}))
app.use(helmet())
app.use(morgan("dev"))


// Health check
app.get("/", (req, res) => {
  res.send("E-Report API is running 🚀");
});

// Routes
app.use("/", authRoutes)
app.use("/", caseRoutes)
app.use("/", personRoutes)
app.use("/", policeStationRoutes)
app.use("/", formRoutes)
app.use("/", adminRoutes)

// Global error handler
app.use((err, req, res, next) => {
  console.error("=== Global Error Handler ===");
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

const PORT = 8082;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});