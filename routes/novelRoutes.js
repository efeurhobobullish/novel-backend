const express = require("express");
const Novel = require("../models/Novel");
const Episode = require("../models/Episode");
const { getNovels, getNovel, getEpisode } = require("../controllers/novelController");

const router = express.Router();

// 🚀 Seeder route (for testing only)
router.get("/seed", async (req, res) => {
  try {
    await Novel.deleteMany();
    await Episode.deleteMany();

    // Create first novel
    const novel1 = await Novel.create({
      title: "The Empire Saga",
      genre: "Fantasy",
      cover: "https://via.placeholder.com/200x300?text=Empire+Saga",
      description: "A tale of kingdoms, battles, and destiny in the Empire Saga.",
    });

    const ep1 = await Episode.create({
      novelId: novel1._id,
      title: "Episode 1: The Awakening",
      content: "In a faraway empire, a hero rises...",
      isFree: true,
    });

    const ep2 = await Episode.create({
      novelId: novel1._id,
      title: "Episode 2: Shadows of War",
      content: "The drums of war begin to sound across the land...",
      isFree: false,
      price: 10,
    });

    novel1.episodes.push(ep1._id, ep2._id);
    await novel1.save();

    // Create second novel
    const novel2 = await Novel.create({
      title: "Romance in Lagos",
      genre: "Romance",
      cover: "https://via.placeholder.com/200x300?text=Romance+in+Lagos",
      description: "A heartfelt love story set in the bustling city of Lagos.",
    });

    const ep3 = await Episode.create({
      novelId: novel2._id,
      title: "Episode 1: A Chance Encounter",
      content: "On a rainy night in Lagos, two strangers meet...",
      isFree: true,
    });

    novel2.episodes.push(ep3._id);
    await novel2.save();

    res.json({ message: "🌱 Seed data inserted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// existing routes
router.get("/", getNovels);
router.get("/:id", getNovel);
router.get("/episode/:id", getEpisode);

module.exports = router;
