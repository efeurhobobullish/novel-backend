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
/**
 * FRONTEND_URLS is a comma-separated list of allowed origins, e.g.:
 * http://localhost:5500,http://127.0.0.1:5500,https://yourdomain.com
 * If you open HTML files directly (file:// origin is null/undefined) we allow it.
 */
const allowedOrigins = (process.env.FRONTEND_URLS || "https://swiftnovel.netlify.app")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // allow mobile apps, curl, Postman, and file:// (no origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"]
};

// Apply CORS early
app.use(cors(corsOptions));
// Handle preflight for all routes
app.options("*", cors(corsOptions));

// Important if you deploy behind a proxy (Heroku/Render/etc.)
app.set("trust proxy", 1);

// NOTE: use raw body for Paystack webhook only (signature check), json elsewhere
const bodyParser = require("body-parser");
app.use((req, res, next) => {
  if (req.path === "/api/wallet/webhook") {
    return bodyParser.raw({ type: "*/*" })(req, res, next);
  }
  return express.json()(req, res, next);
});

// --- SOCKET.IO with CORS ---
const io = new Server(server, {
  cors: {
    origin: allowedOrigins.length ? allowedOrigins : "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});
require("./utils/socket")(io);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/novels", require("./routes/novelRoutes"));
app.use("/api/episodes", require("./routes/episodeRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Error handler
app.use(require("./middleware/errorHandler"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));

// Export io for controllers
module.exports = { io };

/* =========================
   DEMO DATA (auto-seed)
   ========================= */
const User = require("./models/User");
const Novel = require("./models/Novel");
const Episode = require("./models/Episode");
const bcrypt = require("bcryptjs");

async function seedDemoData() {
  const adminEmail = "admin@demo.com";
  const adminPass = "admin123";

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const hashed = await bcrypt.hash(adminPass, 10);
    admin = await User.create({
      username: "Admin",
      email: adminEmail,
      password: hashed,
      role: "admin",
      coins: 1000
    });
    console.log(`✅ Admin created: ${adminEmail} / ${adminPass}`);
  }

  let novel = await Novel.findOne({ title: "Demo Novel" });
  if (!novel) {
    novel = await Novel.create({
      title: "Demo Novel",
      genre: "Fantasy",
      description: "This is a demo novel auto-created.",
      cover: "https://via.placeholder.com/300x400?text=Demo+Novel"
    });
    console.log("📖 Demo novel created");
  }

  let ep1 = await Episode.findOne({ title: "Episode 1" });
  if (!ep1) {
    ep1 = await Episode.create({
      novelId: novel._id,
      title: "Episode 1",
      content: "This is a free demo episode.",
      isFree: true
    });
    await Novel.findByIdAndUpdate(novel._id, { $push: { episodes: ep1._id } });
    console.log("✅ Episode 1 created");
  }

  let ep2 = await Episode.findOne({ title: "Episode 2" });
  if (!ep2) {
    ep2 = await Episode.create({
      novelId: novel._id,
      title: "Episode 2",
      content: "This is a premium demo episode. Costs 10 coins.",
      isFree: false,
      price: 10
    });
    await Novel.findByIdAndUpdate(novel._id, { $push: { episodes: ep2._id } });
    console.log("✅ Episode 2 created");
  }
}
seedDemoData();
