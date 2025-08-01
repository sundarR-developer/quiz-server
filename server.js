import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
import router from './router/route.js';
import connect from './database/conn.js';

const app = express();

/** app middlewares */
app.use(morgan('tiny'));

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://unrivaled-lamington-8daa84.netlify.app'
];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
  credentials: true,
};

app.use(cors(corsOptions));
console.log('CORS middleware configured successfully.');
app.use(express.json());
config();

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
