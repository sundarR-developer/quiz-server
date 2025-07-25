import { config } from "dotenv";
config(); // Load .env file

import express from "express";
import morgan from "morgan";
import cors from "cors";
import router from "./router/route.js";
import authRoute from "./router/authRoute.js";
import connect from "./database/conn.js";
import questionRoute from './router/questionRoute.js';

const app = express();

/** Check if ATLAS_URI is loaded */
console.log("ATLAS_URI:", process.env.ATLAS_URI ? "✅ Loaded" : "❌ Not loaded");

/** MIDDLEWARES */
app.use(morgan("tiny"));

// ✅ CORS setup to allow frontend access from Netlify
app.use(cors({
  origin: "https://marvelous-crostata-4cc3fd.netlify.app", // your frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

/** ROUTES */
app.use("/api", router);
app.use("/api/auth", authRoute);
app.use("/api/questions", questionRoute);

// Root route for testing
app.get("/", (req, res) => {
  res.json("Get root request");
});

app.get("/test", (req, res) => {
  res.send("Test route works!");
});

/** Start server only if DB connection is successful */
const port = process.env.PORT || 8081;

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to MongoDB:", error.message);
  });
