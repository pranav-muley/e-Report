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
app.use(express.json())
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


const PORT = process.env.PORT || 8081;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});