import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import podcastsRoutes from './routes/podcasts.js';
import authRoutes from './routes/auth.js'
import mongoose from 'mongoose';
import morgan from 'morgan'

const app = express();
dotenv.config();

app.use(express.json());
const corsConfig = {
    credentials: true,
    origin: true,
};
app.use(cors(corsConfig));

app.use(morgan('dev'));

const port = process.env.PORT || 8700

mongoose.connect("mongodb://0.0.1.27010/cruddb")

app.use("/api/auth", authRoutes);
app.use("/api/podcasts", podcastsRoutes);

app.listen(port, () => console.log("Server running successfully"));
