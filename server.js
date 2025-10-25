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
// 👇 Fix: allow OPTIONS preflight for all routes
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
app.use("/api/episodes", require("./routes/episodeRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Error handler
app.use(require("./middleware/errorHandler"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));

module.exports = { io };

// === DEMO DATA SEED ===
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