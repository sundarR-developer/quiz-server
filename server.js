import { config } from "dotenv";
config(); // Initialise dotenv first

import express from "express";
import morgan from "morgan";
import cors from "cors";
import router from "./router/route.js";
import authRoute from "./router/authRoute.js";
import connect from "./database/conn.js";
import questionRoute from "./router/questionRoute.js";

console.log("ATLAS_URI:", process.env.ATLAS_URI ? "✅ Loaded" : "❌ Not loaded");

const app = express();

/** ✅ Setup CORS */
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

app.use(morgan("tiny"));
app.use(cors(corsOptions));
app.use(express.json());

/** ✅ API Routes */
app.use("/api", router);
app.use("/api/auth", authRoute);
app.use("/api/questions", questionRoute);

/** ✅ Root route */
app.get("/", (req, res) => {
  try {
    res.json("Get root request");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/** ✅ Health check */
app.get("/test", (req, res) => {
  res.send("Test route works!");
});

/** ✅ Ping route (for CORS/frontend testing) */
app.get("/api/ping", (req, res) => {
  res.json({ msg: "pong" });
});

/** ✅ Start Server */
const port = process.env.PORT || 8081;

connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`✅ Server running at http://localhost:${port}`);
      });
    } catch (error) {
      console.error("❌ Failed to start server:", error.message);
    }
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
  });
