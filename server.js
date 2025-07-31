import { config } from "dotenv";
config(); // Initialise dotenv first

import express from "express";
import morgan from "morgan";
import cors from "cors";
import router from "./router/route.js"; // <-- ONLY import the main, corrected router
import connect from "./database/conn.js";

console.log("ATLAS_URI:", process.env.ATLAS_URI ? "✅ Loaded" : "❌ Not loaded");

const app = express();

/** Middlewares */
app.use(express.json());

/** Setup CORS */
const allowedOrigins = [
  "http://localhost:3000",
  "https://frolicking-quokka-e9d71f.netlify.app",
  "https://relaxed-travesseiro-8cc626.netlify.app",
  "https://guileless-semolina-8b71cf.netlify.app",
  "https://unrivaled-lamington-8daa84.netlify.app",
  "http://localhost:8081"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(morgan("tiny"));
app.disable("x-powered-by"); // Less hackers know about our stack

const port = process.env.PORT || 8080;

/** API Routes */
// This is the critical fix that makes all your API endpoints work correctly.
app.use("/api", router);

/** Start Server only when we have valid connection */
connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`✅ Server connected to http://localhost:${port}`);
      });
    } catch (error) {
      console.log("❌ Cannot connect to the server");
    }
  })
  .catch((error) => {
    console.log("❌ Invalid database connection...!");
    console.error(error);
  });
  
