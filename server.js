const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// --- CORS CONFIG ---
const allowedOrigins = [
  "https://swiftnovel.netlify.app"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS blocked: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
// 👇 Allow OPTIONS preflight for all routes
app.options(/.*/, cors(corsOptions));

app.use(express.json());

// --- SOCKET.IO ---
const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true }
});
require("./utils/socket")(io);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/novels", require("./routes/novelRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));

// Error handler
app.use(require("./middleware/errorHandler"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));

module.exports = { io };