import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import router from './router/route.js';

config();

const app = express();

// Middleware
app.use(morgan('tiny'));
app.use(cors({
    origin: ["http://localhost:3000", "https://unrivaled-lamington-8daa84.netlify.app"],
    credentials: true,
}));
app.use(express.json());
app.disable('x-powered-by'); // Less hackers know about our stack

const PORT = process.env.PORT || 8080;

// API Routes
app.use('/api', router);

// Home Route
app.get('/', (req, res) => {
    res.status(201).json("Home GET Request");
});

// Start server only when we have a valid connection
mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Database Connected");
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.log("Invalid Database Connection...!");
        console.error(error);
    });
