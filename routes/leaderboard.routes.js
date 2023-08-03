const express = require("express");
const { leaderboard_view } = require("../controllers/leaderboard.controller");
const router = express.Router();

router.get("/", leaderboard_view);

module.exports = {
  routes: router,
};
