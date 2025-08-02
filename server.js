import { config } from "dotenv";
config(); // Initialise dotenv first

import express from "express";
import morgan from "morgan";
import cors from "cors";
import router from "./router/route.js";
import authRoute from "./router/authRoute.js";
import connect from "./database/conn.js";
import questionRoute from "./router/questionRoute.js";

// Debug: Check if environment variable is loaded
console.log("ATLAS_URI:", process.env.ATLAS_URI ? "Loaded" : "Not loaded");

const app = express();

/** ✅ Setup CORS */
const allowedOrigins = [
  "http://localhost:3000",
  "https://frolicking-quokka-e9d71f.netlify.app",
  "https://unrivaled-lamington-8daa84.netlify.app/",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// ✅ Middleware
app.use(morgan("tiny"));
app.use(cors(corsOptions));
app.use(express.json());

/** Routes */
app.use("/api", router);
app.use("/api/auth", authRoute);
app.use("/api/questions", questionRoute);

// Root route
app.get("/", (req, res) => {
  try {
    res.json("Get root request");
  } catch (error) {
    res.json(error.message);
  }
});

// Health check route
app.get("/test", (req, res) => {
  res.send("Test route works!");
});

/** Connect to MongoDB and Start Server */
const port = process.env.PORT || 8081;

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


