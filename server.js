import { config } from "dotenv";
config(); // initialise app with Dotenv - must be first!

import express from "express";
import morgan from "morgan";
import cors from "cors";
import router from "./router/route.js";
import authRoute from "./router/authRoute.js";
import connect from "./database/conn.js";
import questionRoute from './router/questionRoute.js';

// Debug: Check if environment variable is loaded
console.log("ATLAS_URI:", process.env.ATLAS_URI ? "Loaded" : "Not loaded");

const app = express();

/** MIDDLEWARE APP */
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

/** APP PORT NUMBERS */
const port = process.env.PORT || 8081; // process.env.PORT doesn't exist for some reason

/** ROUTES */
// api routes
app.use("/api", router);
app.use("/api/auth", authRoute);
app.use('/api/questions', questionRoute);
// root route
app.get("/", (req, res) => {
  try {
    res.json("Get root request");
  } catch (error) {
    res.json(error.message);
  }
});

app.get("/test", (req, res) => {
  res.send("Test route works!");
});

/** Connect to MongoDB database */

// Start server only when we have a valid database connection
connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server connected to http://localhost:${port}`);
      });
    } catch (error) {
      console.log("Cannot connect to server");
    }
  })
  .catch((error) => {
    console.log("Invalid database connection");
  }); 