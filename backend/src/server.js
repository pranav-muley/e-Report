import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from "./config/mongoConfig.js";

const PORT = process.env.PORT || 4000;

dotenv.config();

// ---------- Create App ----------
const app = express();

// ---------- Middlewares ----------
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// check DB connection....
connectDB()

// ---------- Start Server ----------
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
