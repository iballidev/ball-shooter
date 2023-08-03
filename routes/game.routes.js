const express = require("express");
const {
  game_view,
} = require("../controllers/game.controller");
const router = express.Router();

router.get("/", game_view);

module.exports = {
  routes: router,
};
