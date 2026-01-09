require("dotenv").config()

const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")

const connectDB = require("./config/mongoConfig")
const authRoutes = require("./routes/authRoutes")

const app = express()

// 🔑 MIDDLEWARE ORDER (IMPORTANT)
app.use(express.json())
app.use(cookieParser())   // ✅ MUST COME BEFORE ROUTES
app.use(cors({
  origin: true,
  credentials: true
}))
app.use(helmet())
app.use(morgan("dev"))

// Routes
app.use("/", authRoutes)

connectDB()

app.listen(8081, () => {
  console.log("Server running on port 8081")
})