const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

/** ---------- CORS CONFIG ---------- */
const allowedOrigins = [
  "https://swiftnovel.netlify.app", // your Netlify frontend
  "http://localhost:3000"           // local dev
];

const corsOptions = {
  origin(origin, callback) {
    // allow requests without origin (Postman, curl, etc.)
    if (!origin) return callback(null, true);
    // allow if origin is in whitelist
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // otherwise block
    return callback(new Error("CORS blocked: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
};

// ✅ enable CORS globally
app.use(cors(corsOptions));
/** -------------------------------- */

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/novels", require("./routes/novelRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
