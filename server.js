import { config } from "dotenv";
<<<<<<< HEAD
config(); // Load .env file
=======
config(); // Initialise dotenv first
>>>>>>> 560bfdd (Fix: Added CORS whitelist for frontend)

import express from "express";
import morgan from "morgan";
import cors from "cors";
import router from "./router/route.js";
import authRoute from "./router/authRoute.js";
import connect from "./database/conn.js";
import questionRoute from "./router/questionRoute.js";

const app = express();

<<<<<<< HEAD
/** Check if ATLAS_URI is loaded */
console.log("ATLAS_URI:", process.env.ATLAS_URI ? "✅ Loaded" : "❌ Not loaded");

/** MIDDLEWARES */
app.use(morgan("tiny"));

// ✅ CORS setup to allow frontend access from Netlify
app.use(cors({
  origin: "https://frolicking-quokka-e9d71f.netlify.app/", // your frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

/** ROUTES */
=======
/** ✅ Setup CORS */
const allowedOrigins = [
  "http://localhost:3000",
  "https://frolicking-quokka-e9d71f.netlify.app",
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
>>>>>>> 560bfdd (Fix: Added CORS whitelist for frontend)
app.use("/api", router);
app.use("/api/auth", authRoute);
app.use("/api/questions", questionRoute);

<<<<<<< HEAD
// Root route for testing
=======
// Root route
>>>>>>> 560bfdd (Fix: Added CORS whitelist for frontend)
app.get("/", (req, res) => {
  res.json("Get root request");
});

// Health check route
app.get("/test", (req, res) => {
  res.send("Test route works!");
});

<<<<<<< HEAD
/** Start server only if DB connection is successful */
=======
/** Connect to MongoDB and Start Server */
>>>>>>> 560bfdd (Fix: Added CORS whitelist for frontend)
const port = process.env.PORT || 8081;

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
<<<<<<< HEAD
    console.error("❌ Failed to connect to MongoDB:", error.message);
=======
    console.log("Invalid database connection");
>>>>>>> 560bfdd (Fix: Added CORS whitelist for frontend)
  });
