import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 4000;

// ---------- Create App ----------
const app = express();

// ---------- Middlewares ----------
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// ---------- Start Server ----------
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
