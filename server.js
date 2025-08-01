import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
import router from './router/route.js';
import connect from './database/conn.js';

config(); // Load environment variables at the very top

const app = express();

/** app middlewares */
app.use(morgan('tiny'));
app.use(express.json());

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://unrivaled-lamington-8daa84.netlify.app',
  'https://quiz-server-9.onrender.com'
];

// CORS configuration
const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
  credentials: true,
};

// Handle pre-flight requests and set CORS headers
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes
app.use(cors(corsOptions));
console.log('CORS middleware configured successfully.');

/** api routes */
app.use('/api', router);

app.get('/', (req, res) => {
  try {
    res.json('Get Request');
  } catch (error) {
    res.json(error);
  }
});

/** start server only when we have valid connection */
const port = process.env.PORT || 8080;
connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server connected to http://localhost:${port}`);
      });
    } catch (error) {
      console.log('Cannot connect to the server');
    }
  })
  .catch((error) => {
    console.log('Invalid Database Connection...!');
    console.log(error);
  });
