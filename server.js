import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
import router from './router/route.js';
import connect from './database/conn.js';

config(); // Load environment variables at the very top

const app = express();

// ✅ Fix 1: Define CORS config early
const allowedOrigins = [
  'http://localhost:3000',
  'https://unrivaled-lamington-8daa84.netlify.app',
  'https://quiz-server-9.onrender.com',
  'https://wondrous-manatee-925699.netlify.app'
];

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'] // ✅ Allow Authorization header
};

// ✅ Fix 2: Use CORS middleware first
app.use(cors(corsOptions));
app.use(morgan('tiny'));
app.use(express.json());

// ✅ API routes
app.use('/api', router);

app.get('/', (req, res) => {
  res.json('Get Request');
});

const port = process.env.PORT || 8080;
connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server connected to http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log('Invalid Database Connection...!');
    console.log(error);
  });
