import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import podcastsRoutes from './routes/podcasts.js';
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
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

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Event listener for connection errors
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Event listener for successful connection
db.once('open', () => {
    console.log('MongoDB connected successfully!');
});

app.use("/api/auth", authRoutes);
app.use("/api/podcasts", podcastsRoutes);
app.use("/api/user", userRoutes);


app.listen(port, () => console.log(`Server running successfully`));
