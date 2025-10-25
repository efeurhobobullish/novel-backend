const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

/** ---------- CORS (Frontend-safe) ---------- */
const allowedOrigins = [
  "https://swiftnovel.netlify.app"
];

// optionally support comma-separated env var FRONTEND_ORIGINS
if (process.env.FRONTEND_ORIGINS) {
  process.env.FRONTEND_ORIGINS.split(",")
    .map(s => s.trim())
    .filter(Boolean)
    .forEach(o => { if (!allowedOrigins.includes(o)) allowedOrigins.push(o); });
}

const corsOptions = {
  origin(origin, callback) {
    // allow non-browser clients (e.g., Postman) with no Origin header
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204, // some legacy browsers choke on 200
};

app.use(cors(corsOptions));
// handle all preflight requests quickly
app.options("*", cors(corsOptions));
/** ----------------------------------------- */

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
