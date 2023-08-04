const express = require("express");
const { leaderboard_view, leaderboard } = require("../controllers/leaderboard.controller");
const router = express.Router();

router.get("/", leaderboard_view);
router.get("/players", leaderboard);

module.exports = {
  routes: router,
};
