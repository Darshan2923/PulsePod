import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js'

const app = express();
dotenv.config();

app.use(express.json());
const corsConfig = {
    credentials: true,
    origin: true,
};
app.use(cors(corsConfig));

const port = process.env.PORT || 8700

app.use("/api/auth", authRoutes);

app.listen(port, () => console.log("Server running successfully"));
